using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QuichmechBackend.Data;
using QuichmechBackend.DTOs.ServiceRequest;
using QuichmechBackend.Models;
using QuichmechBackend.Service.Interface;

namespace QuichmechBackend.Service
{
    public class ServiceRequestService : IServiceRequestService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILocationService _locationService;

        public ServiceRequestService(
            ApplicationDbContext context,
            IMapper mapper,
            ILocationService locationService)
        {
            _context = context;
            _mapper = mapper;
            _locationService = locationService;
        }

        public async Task<ServiceRequestDto?> CreateServiceRequestAsync(string userId, CreateServiceRequestDto dto)
        {
            var customer = await _context.Customers
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (customer == null)
            {
                return null;
            }

            var serviceRequest = _mapper.Map<ServiceRequest>(dto);
            serviceRequest.CustomerId = customer.Id;
            serviceRequest.Status = ServiceRequestStatus.Pending;
            serviceRequest.RequestedAt = DateTime.UtcNow;

            _context.ServiceRequests.Add(serviceRequest);
            await _context.SaveChangesAsync();

            return await GetServiceRequestByIdAsync(serviceRequest.Id);
        }

        public async Task<ServiceRequestDto?> GetServiceRequestByIdAsync(int id)
        {
            var request = await _context.ServiceRequests
                .Include(sr => sr.Customer)
                    .ThenInclude(c => c.User)
                .Include(sr => sr.Mechanic)
                    .ThenInclude(m => m!.User)
                .FirstOrDefaultAsync(sr => sr.Id == id);

            return request == null ? null : _mapper.Map<ServiceRequestDto>(request);
        }

        public async Task<List<ServiceRequestDto>> GetCustomerServiceRequestsAsync(string userId)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (customer == null)
            {
                return new List<ServiceRequestDto>();
            }

            var requests = await _context.ServiceRequests
                .Include(sr => sr.Customer)
                    .ThenInclude(c => c.User)
                .Include(sr => sr.Mechanic)
                    .ThenInclude(m => m!.User)
                .Where(sr => sr.CustomerId == customer.Id)
                .OrderByDescending(sr => sr.RequestedAt)
                .ToListAsync();

            return _mapper.Map<List<ServiceRequestDto>>(requests);
        }

        public async Task<List<ServiceRequestDto>> GetMechanicServiceRequestsAsync(string userId)
        {
            var mechanic = await _context.Mechanics
                .FirstOrDefaultAsync(m => m.UserId == userId);

            if (mechanic == null)
            {
                return new List<ServiceRequestDto>();
            }

            var requests = await _context.ServiceRequests
                .Include(sr => sr.Customer)
                    .ThenInclude(c => c.User)
                .Include(sr => sr.Mechanic)
                    .ThenInclude(m => m!.User)
                .Where(sr => sr.MechanicId == mechanic.Id)
                .OrderByDescending(sr => sr.RequestedAt)
                .ToListAsync();

            return _mapper.Map<List<ServiceRequestDto>>(requests);
        }

        public async Task<ServiceRequestDto?> AssignMechanicAsync(int requestId, int mechanicId)
        {
            var request = await _context.ServiceRequests
                .Include(sr => sr.Customer)
                    .ThenInclude(c => c.User)
                .Include(sr => sr.Mechanic)
                    .ThenInclude(m => m!.User)
                .FirstOrDefaultAsync(sr => sr.Id == requestId);

            if (request == null || request.Status != ServiceRequestStatus.Pending)
            {
                return null;
            }

            var mechanic = await _context.Mechanics.FindAsync(mechanicId);
            if (mechanic == null || !mechanic.IsAvailable)
            {
                return null;
            }

            request.MechanicId = mechanicId;
            request.Status = ServiceRequestStatus.Accepted;
            request.AcceptedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return _mapper.Map<ServiceRequestDto>(request);
        }

        public async Task<ServiceRequestDto?> UpdateStatusAsync(int requestId, string userId, UpdateServiceRequestStatusDto dto)
        {
            var request = await _context.ServiceRequests
                .Include(sr => sr.Customer)
                    .ThenInclude(c => c.User)
                .Include(sr => sr.Mechanic)
                    .ThenInclude(m => m!.User)
                .FirstOrDefaultAsync(sr => sr.Id == requestId);

            if (request == null)
            {
                return null;
            }

            // Verify user has permission to update
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.UserId == userId);
            var mechanic = await _context.Mechanics.FirstOrDefaultAsync(m => m.UserId == userId);

            bool isAuthorized = (customer != null && request.CustomerId == customer.Id) ||
                               (mechanic != null && request.MechanicId == mechanic.Id);

            if (!isAuthorized)
            {
                return null;
            }

            request.Status = dto.Status;

            if (dto.EstimatedCost.HasValue)
            {
                request.EstimatedCost = dto.EstimatedCost.Value;
            }

            if (dto.FinalCost.HasValue)
            {
                request.FinalCost = dto.FinalCost.Value;
            }

            if (!string.IsNullOrEmpty(dto.Notes))
            {
                request.Notes = dto.Notes;
            }

            if (dto.Status == ServiceRequestStatus.Completed)
            {
                request.CompletedAt = DateTime.UtcNow;
            }
            else if (dto.Status == ServiceRequestStatus.Cancelled)
            {
                request.CancelledAt = DateTime.UtcNow;
                request.CancellationReason = dto.CancellationReason;
            }

            await _context.SaveChangesAsync();

            return _mapper.Map<ServiceRequestDto>(request);
        }

        public async Task<List<ServiceRequestDto>> GetPendingRequestsNearMechanicAsync(string mechanicUserId, double radiusKm)
        {
            var mechanic = await _context.Mechanics
                .FirstOrDefaultAsync(m => m.UserId == mechanicUserId);

            if (mechanic == null)
            {
                return new List<ServiceRequestDto>();
            }

            var pendingRequests = await _context.ServiceRequests
                .Include(sr => sr.Customer)
                    .ThenInclude(c => c.User)
                .Where(sr => sr.Status == ServiceRequestStatus.Pending)
                .ToListAsync();

            var nearbyRequests = pendingRequests
                .Where(sr =>
                {
                    var distance = _locationService.CalculateDistance(
                        mechanic.Latitude, mechanic.Longitude,
                        sr.Latitude, sr.Longitude);
                    return distance <= radiusKm;
                })
                .ToList();

            return _mapper.Map<List<ServiceRequestDto>>(nearbyRequests);
        }
    }
}

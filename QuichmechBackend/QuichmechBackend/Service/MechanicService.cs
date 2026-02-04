using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QuichmechBackend.Data;
using QuichmechBackend.DTOs.Mechanic;
using QuichmechBackend.Service.Interface;

namespace QuichmechBackend.Service
{
    public class MechanicService : IMechanicService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILocationService _locationService;

        public MechanicService(
            ApplicationDbContext context,
            IMapper mapper,
            ILocationService locationService)
        {
            _context = context;
            _mapper = mapper;
            _locationService = locationService;
        }

        public async Task<MechanicDto?> GetMechanicByUserIdAsync(string userId)
        {
            var mechanic = await _context.Mechanics
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.UserId == userId);

            return mechanic == null ? null : _mapper.Map<MechanicDto>(mechanic);
        }

        public async Task<MechanicDto?> GetMechanicByIdAsync(int mechanicId)
        {
            var mechanic = await _context.Mechanics
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.Id == mechanicId);

            return mechanic == null ? null : _mapper.Map<MechanicDto>(mechanic);
        }

        public async Task<MechanicDto?> UpdateProfileAsync(string userId, MechanicProfileDto profileDto)
        {
            var mechanic = await _context.Mechanics
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.UserId == userId);

            if (mechanic == null)
            {
                return null;
            }

            mechanic.ShopName = profileDto.ShopName;
            mechanic.Address = profileDto.Address;
            mechanic.Latitude = profileDto.Latitude;
            mechanic.Longitude = profileDto.Longitude;
            mechanic.Specialization = profileDto.Specialization;
            mechanic.YearsOfExperience = profileDto.YearsOfExperience;
            mechanic.LicenseNumber = profileDto.LicenseNumber;
            mechanic.HourlyRate = profileDto.HourlyRate;
            mechanic.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return _mapper.Map<MechanicDto>(mechanic);
        }

        public async Task<bool> UpdateAvailabilityAsync(string userId, bool isAvailable)
        {
            var mechanic = await _context.Mechanics
                .FirstOrDefaultAsync(m => m.UserId == userId);

            if (mechanic == null)
            {
                return false;
            }

            mechanic.IsAvailable = isAvailable;
            mechanic.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<MechanicDto>> GetNearbyMechanicsAsync(NearbyMechanicsQuery query)
        {
            var mechanicsQuery = _context.Mechanics
                .Include(m => m.User)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(query.Specialization))
            {
                mechanicsQuery = mechanicsQuery.Where(m =>
                    m.Specialization != null && m.Specialization.Contains(query.Specialization));
            }

            if (query.IsAvailable.HasValue)
            {
                mechanicsQuery = mechanicsQuery.Where(m => m.IsAvailable == query.IsAvailable.Value);
            }

            if (query.MaxHourlyRate.HasValue)
            {
                mechanicsQuery = mechanicsQuery.Where(m => m.HourlyRate <= query.MaxHourlyRate.Value);
            }

            if (query.MinRating.HasValue)
            {
                mechanicsQuery = mechanicsQuery.Where(m => m.AverageRating >= query.MinRating.Value);
            }

            var mechanics = await mechanicsQuery.ToListAsync();

            // Calculate distances and filter by radius
            var mechanicsWithDistance = mechanics
                .Select(m =>
                {
                    var dto = _mapper.Map<MechanicDto>(m);
                    dto.Distance = _locationService.CalculateDistance(
                        query.Latitude, query.Longitude,
                        m.Latitude, m.Longitude);
                    return dto;
                })
                .Where(m => m.Distance <= query.RadiusKm)
                .OrderBy(m => m.Distance)
                .ToList();

            return mechanicsWithDistance;
        }
    }
}

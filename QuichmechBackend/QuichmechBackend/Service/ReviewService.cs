using AutoMapper;
using Microsoft.EntityFrameworkCore;
using QuichmechBackend.Data;
using QuichmechBackend.DTOs.Review;
using QuichmechBackend.Models;
using QuichmechBackend.Service.Interface;

namespace QuichmechBackend.Service
{
    public class ReviewService : IReviewService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ReviewService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ReviewDto?> CreateReviewAsync(string userId, CreateReviewDto dto)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (customer == null)
            {
                return null;
            }

            var serviceRequest = await _context.ServiceRequests
                .Include(sr => sr.Review)
                .FirstOrDefaultAsync(sr => sr.Id == dto.ServiceRequestId);

            if (serviceRequest == null ||
                serviceRequest.CustomerId != customer.Id ||
                serviceRequest.Status != ServiceRequestStatus.Completed ||
                serviceRequest.MechanicId == null ||
                serviceRequest.Review != null)
            {
                return null;
            }

            var review = new Review
            {
                ServiceRequestId = dto.ServiceRequestId,
                CustomerId = customer.Id,
                MechanicId = serviceRequest.MechanicId.Value,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Update mechanic's average rating
            await UpdateMechanicRatingAsync(serviceRequest.MechanicId.Value);

            return await GetReviewByIdAsync(review.Id);
        }

        public async Task<List<ReviewDto>> GetMechanicReviewsAsync(int mechanicId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.Customer)
                    .ThenInclude(c => c.User)
                .Include(r => r.Mechanic)
                    .ThenInclude(m => m.User)
                .Where(r => r.MechanicId == mechanicId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<ReviewDto>>(reviews);
        }

        public async Task<ReviewDto?> GetReviewByIdAsync(int reviewId)
        {
            var review = await _context.Reviews
                .Include(r => r.Customer)
                    .ThenInclude(c => c.User)
                .Include(r => r.Mechanic)
                    .ThenInclude(m => m.User)
                .FirstOrDefaultAsync(r => r.Id == reviewId);

            return review == null ? null : _mapper.Map<ReviewDto>(review);
        }

        private async Task UpdateMechanicRatingAsync(int mechanicId)
        {
            var mechanic = await _context.Mechanics
                .Include(m => m.Reviews)
                .FirstOrDefaultAsync(m => m.Id == mechanicId);

            if (mechanic == null || !mechanic.Reviews.Any())
            {
                return;
            }

            mechanic.AverageRating = mechanic.Reviews.Average(r => r.Rating);
            mechanic.TotalReviews = mechanic.Reviews.Count;
            mechanic.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }
}

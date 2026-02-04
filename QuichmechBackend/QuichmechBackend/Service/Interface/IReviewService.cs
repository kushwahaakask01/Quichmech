using QuichmechBackend.DTOs.Review;

namespace QuichmechBackend.Service.Interface
{
    public interface IReviewService
    {
        Task<ReviewDto?> CreateReviewAsync(string userId, CreateReviewDto dto);
        Task<List<ReviewDto>> GetMechanicReviewsAsync(int mechanicId);
        Task<ReviewDto?> GetReviewByIdAsync(int reviewId);
    }
}

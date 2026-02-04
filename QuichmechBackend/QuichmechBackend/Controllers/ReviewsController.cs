using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuichmechBackend.DTOs.Review;
using QuichmechBackend.Service.Interface;
using System.Security.Claims;

namespace QuichmechBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        private readonly ILogger<ReviewsController> _logger;

        public ReviewsController(IReviewService reviewService, ILogger<ReviewsController> logger)
        {
            _reviewService = reviewService;
            _logger = logger;
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var review = await _reviewService.CreateReviewAsync(userId, dto);

                if (review == null)
                {
                    return BadRequest(new { message = "Failed to create review. Service may not be completed or already reviewed." });
                }

                return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating review");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewDto>> GetReview(int id)
        {
            try
            {
                var review = await _reviewService.GetReviewByIdAsync(id);

                if (review == null)
                {
                    return NotFound(new { message = "Review not found" });
                }

                return Ok(review);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting review");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        [HttpGet("mechanic/{mechanicId}")]
        public async Task<ActionResult<List<ReviewDto>>> GetMechanicReviews(int mechanicId)
        {
            try
            {
                var reviews = await _reviewService.GetMechanicReviewsAsync(mechanicId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting mechanic reviews");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }
    }

}

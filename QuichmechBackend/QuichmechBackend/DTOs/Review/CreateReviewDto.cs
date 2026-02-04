using System.ComponentModel.DataAnnotations;

namespace QuichmechBackend.DTOs.Review
{
    public class CreateReviewDto
    {
        [Required]
        public int ServiceRequestId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        public string? Comment { get; set; }
    }
}

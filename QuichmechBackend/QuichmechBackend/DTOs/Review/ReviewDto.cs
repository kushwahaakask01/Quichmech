namespace QuichmechBackend.DTOs.Review
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public int ServiceRequestId { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public int MechanicId { get; set; }
        public string MechanicName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

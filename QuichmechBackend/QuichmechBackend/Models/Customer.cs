namespace QuichmechBackend.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string? Address { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<ServiceRequest> ServiceRequests { get; set; } = new List<ServiceRequest>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}

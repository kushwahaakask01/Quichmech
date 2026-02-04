namespace QuichmechBackend.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int ServiceRequestId { get; set; }
        public int CustomerId { get; set; }
        public int MechanicId { get; set; }
        public int Rating { get; set; } // 1-5
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ServiceRequest ServiceRequest { get; set; } = null!;
        public virtual Customer Customer { get; set; } = null!;
        public virtual Mechanic Mechanic { get; set; } = null!;
    }
}

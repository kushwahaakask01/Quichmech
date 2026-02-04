namespace QuichmechBackend.Models
{
    public class Mechanic
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string? ShopName { get; set; }
        public string? Address { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? Specialization { get; set; }
        public int YearsOfExperience { get; set; }
        public string? LicenseNumber { get; set; }
        public bool IsVerified { get; set; } = false;
        public bool IsAvailable { get; set; } = true;
        public decimal HourlyRate { get; set; }
        public double AverageRating { get; set; } = 0;
        public int TotalReviews { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<ServiceRequest> ServiceRequests { get; set; } = new List<ServiceRequest>();
        public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
        public virtual ICollection<MechanicServiceModel> MechanicServices { get; set; } = new List<MechanicServiceModel>();
    }
}

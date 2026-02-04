namespace QuichmechBackend.Models
{
    public class ServiceRequest
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int? MechanicId { get; set; }
        public string VehicleType { get; set; } = string.Empty;
        public string VehicleMake { get; set; } = string.Empty;
        public string VehicleModel { get; set; } = string.Empty;
        public string? VehicleYear { get; set; }
        public string IssueDescription { get; set; } = string.Empty;
        public string ServiceType { get; set; } = string.Empty; // e.g., "Emergency", "Scheduled", "Diagnostic"
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? Address { get; set; }
        public ServiceRequestStatus Status { get; set; } = ServiceRequestStatus.Pending;
        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? AcceptedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? CancelledAt { get; set; }
        public string? CancellationReason { get; set; }
        public decimal? EstimatedCost { get; set; }
        public decimal? FinalCost { get; set; }
        public string? Notes { get; set; }

        // Navigation properties
        public virtual Customer Customer { get; set; } = null!;
        public virtual Mechanic? Mechanic { get; set; }
        public virtual Review? Review { get; set; }
    }

    public enum ServiceRequestStatus
    {
        Pending,
        Accepted,
        InProgress,
        Completed,
        Cancelled,
        Rejected
    }
}

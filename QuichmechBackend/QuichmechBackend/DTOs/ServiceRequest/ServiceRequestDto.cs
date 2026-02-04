using QuichmechBackend.Models;

namespace QuichmechBackend.DTOs.ServiceRequest
{
    public class ServiceRequestDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public int? MechanicId { get; set; }
        public string? MechanicName { get; set; }
        public string? MechanicPhone { get; set; }
        public string VehicleType { get; set; } = string.Empty;
        public string VehicleMake { get; set; } = string.Empty;
        public string VehicleModel { get; set; } = string.Empty;
        public string? VehicleYear { get; set; }
        public string IssueDescription { get; set; } = string.Empty;
        public string ServiceType { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? Address { get; set; }
        public ServiceRequestStatus Status { get; set; }
        public DateTime RequestedAt { get; set; }
        public DateTime? AcceptedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public decimal? EstimatedCost { get; set; }
        public decimal? FinalCost { get; set; }
        public string? Notes { get; set; }
    }
}

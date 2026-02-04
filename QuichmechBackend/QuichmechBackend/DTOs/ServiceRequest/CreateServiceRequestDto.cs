using System.ComponentModel.DataAnnotations;

namespace QuichmechBackend.DTOs.ServiceRequest
{
    public class CreateServiceRequestDto
    {
        [Required]
        public string VehicleType { get; set; } = string.Empty;

        [Required]
        public string VehicleMake { get; set; } = string.Empty;

        [Required]
        public string VehicleModel { get; set; } = string.Empty;

        public string? VehicleYear { get; set; }

        [Required]
        public string IssueDescription { get; set; } = string.Empty;

        [Required]
        public string ServiceType { get; set; } = string.Empty;

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        public string? Address { get; set; }
    }
}

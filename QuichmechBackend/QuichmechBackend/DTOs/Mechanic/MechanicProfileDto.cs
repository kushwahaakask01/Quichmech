using System.ComponentModel.DataAnnotations;

namespace QuichmechBackend.DTOs.Mechanic
{
    public class MechanicProfileDto
    {
        [Required]
        public string ShopName { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        public string? Specialization { get; set; }

        [Required]
        [Range(0, 50)]
        public int YearsOfExperience { get; set; }

        public string? LicenseNumber { get; set; }

        [Required]
        [Range(0, 10000)]
        public decimal HourlyRate { get; set; }
    }
}

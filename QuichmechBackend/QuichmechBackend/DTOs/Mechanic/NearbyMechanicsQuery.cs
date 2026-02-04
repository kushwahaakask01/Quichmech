using System.ComponentModel.DataAnnotations;

namespace QuichmechBackend.DTOs.Mechanic
{
    public class NearbyMechanicsQuery
    {
        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        [Range(1, 100)]
        public double RadiusKm { get; set; } = 10; // Default 10km radius

        public string? Specialization { get; set; }
        public bool? IsAvailable { get; set; }
        public decimal? MaxHourlyRate { get; set; }
        public double? MinRating { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace QuichmechBackend.DTOs.Mechanic
{
    public class UpdateMechanicAvailabilityDto
    {
        [Required]
        public bool IsAvailable { get; set; }
    }
}

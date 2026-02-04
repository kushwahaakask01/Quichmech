using System.ComponentModel.DataAnnotations;

namespace QuichmechBackend.DTOs.ServiceRequest
{
    public class AssignMechanicDto
    {
        [Required]
        public int MechanicId { get; set; }
    }
}

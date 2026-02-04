using QuichmechBackend.Models;
using System.ComponentModel.DataAnnotations;

namespace QuichmechBackend.DTOs.ServiceRequest
{
    public class UpdateServiceRequestStatusDto
    {
        [Required]
        public ServiceRequestStatus Status { get; set; }

        public decimal? EstimatedCost { get; set; }
        public decimal? FinalCost { get; set; }
        public string? Notes { get; set; }
        public string? CancellationReason { get; set; }
    }
}

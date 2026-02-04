namespace QuichmechBackend.Models
{
    public class MechanicServiceModel
    {
        public int Id { get; set; }
        public int MechanicId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int EstimatedDurationMinutes { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual Mechanic Mechanic { get; set; } = null!;
    }
}

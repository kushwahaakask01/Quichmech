using Microsoft.AspNetCore.Identity;

namespace QuichmechBackend.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation properties
        public virtual Customer? Customer { get; set; }
        public virtual Mechanic? Mechanic { get; set; }
    }
}

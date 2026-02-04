namespace QuichmechBackend.DTOs.Mechanic
{
    public class MechanicDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? ShopName { get; set; }
        public string? Address { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? Specialization { get; set; }
        public int YearsOfExperience { get; set; }
        public bool IsVerified { get; set; }
        public bool IsAvailable { get; set; }
        public decimal HourlyRate { get; set; }
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
        public double? Distance { get; set; } // Distance from search location in km

    }
}

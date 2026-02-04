using QuichmechBackend.DTOs.Mechanic;

namespace QuichmechBackend.Service.Interface
{
    public interface IMechanicService
    {
        Task<MechanicDto?> GetMechanicByUserIdAsync(string userId);
        Task<MechanicDto?> UpdateProfileAsync(string userId, MechanicProfileDto profileDto);
        Task<bool> UpdateAvailabilityAsync(string userId, bool isAvailable);
        Task<List<MechanicDto>> GetNearbyMechanicsAsync(NearbyMechanicsQuery query);
        Task<MechanicDto?> GetMechanicByIdAsync(int mechanicId);
    }
}

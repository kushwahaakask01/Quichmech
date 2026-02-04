using QuichmechBackend.DTOs.ServiceRequest;

namespace QuichmechBackend.Service.Interface
{
    public interface IServiceRequestService
    {
        Task<ServiceRequestDto?> CreateServiceRequestAsync(string userId, CreateServiceRequestDto dto);
        Task<ServiceRequestDto?> GetServiceRequestByIdAsync(int id);
        Task<List<ServiceRequestDto>> GetCustomerServiceRequestsAsync(string userId);
        Task<List<ServiceRequestDto>> GetMechanicServiceRequestsAsync(string userId);
        Task<ServiceRequestDto?> AssignMechanicAsync(int requestId, int mechanicId);
        Task<ServiceRequestDto?> UpdateStatusAsync(int requestId, string userId, UpdateServiceRequestStatusDto dto);
        Task<List<ServiceRequestDto>> GetPendingRequestsNearMechanicAsync(string mechanicUserId, double radiusKm);
    }
}

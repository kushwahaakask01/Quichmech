using QuichmechBackend.DTOs.Authentication;

namespace QuichmechBackend.Service.Interface
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    }
}

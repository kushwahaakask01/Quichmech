using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using QuichmechBackend.Data;
using QuichmechBackend.DTOs.Authentication;
using QuichmechBackend.Models;
using QuichmechBackend.Service.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace QuichmechBackend.Service
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthService(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _context = context;
        }

        public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
        {
            var user = new User
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                PhoneNumber = registerDto.PhoneNumber,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return null;
            }

            // Add role
            await _userManager.AddToRoleAsync(user, registerDto.Role);

            // Create corresponding profile based on role
            if (registerDto.Role.Equals("Customer", StringComparison.OrdinalIgnoreCase))
            {
                var customer = new Customer
                {
                    UserId = user.Id
                };
                _context.Customers.Add(customer);
            }
            else if (registerDto.Role.Equals("Mechanic", StringComparison.OrdinalIgnoreCase))
            {
                var mechanic = new Mechanic
                {
                    UserId = user.Id
                };
                _context.Mechanics.Add(mechanic);
            }

            await _context.SaveChangesAsync();

            return await GenerateAuthResponse(user, registerDto.Role);
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null || !user.IsActive)
            {
                return null;
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded)
            {
                return null;
            }

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "Customer";

            return await GenerateAuthResponse(user, role);
        }

        private async Task<AuthResponseDto> GenerateAuthResponse(User user, string role)
        {
            var token = GenerateJwtToken(user, role);
            var expiresAt = DateTime.UtcNow.AddHours(24);

            return new AuthResponseDto
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = role,
                ExpiresAt = expiresAt
            };
        }

        private string GenerateJwtToken(User user, string role)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(ClaimTypes.Role, role)
        };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

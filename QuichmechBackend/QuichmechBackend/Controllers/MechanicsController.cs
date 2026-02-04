using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuichmechBackend.DTOs.Mechanic;
using QuichmechBackend.Service.Interface;
using System.Security.Claims;

namespace QuichmechBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MechanicsController : ControllerBase
    {
        private readonly IMechanicService _mechanicService;
        private readonly ILogger<MechanicsController> _logger;

        public MechanicsController(IMechanicService mechanicService, ILogger<MechanicsController> logger)
        {
            _mechanicService = mechanicService;
            _logger = logger;
        }

        [HttpGet("profile")]
        [Authorize(Roles = "Mechanic")]
        public async Task<ActionResult<MechanicDto>> GetProfile()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var mechanic = await _mechanicService.GetMechanicByUserIdAsync(userId);

                if (mechanic == null)
                {
                    return NotFound(new { message = "Mechanic profile not found" });
                }

                return Ok(mechanic);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting mechanic profile");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        [HttpPut("profile")]
        [Authorize(Roles = "Mechanic")]
        public async Task<ActionResult<MechanicDto>> UpdateProfile([FromBody] MechanicProfileDto profileDto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var mechanic = await _mechanicService.UpdateProfileAsync(userId, profileDto);

                if (mechanic == null)
                {
                    return NotFound(new { message = "Mechanic profile not found" });
                }

                return Ok(mechanic);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating mechanic profile");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        [HttpPatch("availability")]
        [Authorize(Roles = "Mechanic")]
        public async Task<ActionResult> UpdateAvailability([FromBody] UpdateMechanicAvailabilityDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var result = await _mechanicService.UpdateAvailabilityAsync(userId, dto.IsAvailable);

                if (!result)
                {
                    return NotFound(new { message = "Mechanic profile not found" });
                }

                return Ok(new { message = "Availability updated successfully", isAvailable = dto.IsAvailable });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating mechanic availability");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        [HttpPost("nearby")]
        [AllowAnonymous]
        public async Task<ActionResult<List<MechanicDto>>> GetNearbyMechanics([FromBody] NearbyMechanicsQuery query)
        {
            try
            {
                var mechanics = await _mechanicService.GetNearbyMechanicsAsync(query);
                return Ok(mechanics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting nearby mechanics");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MechanicDto>> GetMechanicById(int id)
        {
            try
            {
                var mechanic = await _mechanicService.GetMechanicByIdAsync(id);

                if (mechanic == null)
                {
                    return NotFound(new { message = "Mechanic not found" });
                }

                return Ok(mechanic);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting mechanic by id");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }
    }
}

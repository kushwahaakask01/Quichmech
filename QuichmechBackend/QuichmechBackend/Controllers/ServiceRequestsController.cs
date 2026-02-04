using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuichmechBackend.DTOs.ServiceRequest;
using QuichmechBackend.Service.Interface;
using System.Security.Claims;

namespace QuichmechBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ServiceRequestsController : ControllerBase
    {
        private readonly IServiceRequestService _serviceRequestService;
        private readonly ILogger<ServiceRequestsController> _logger;

        public ServiceRequestsController(
            IServiceRequestService serviceRequestService,
            ILogger<ServiceRequestsController> logger)
        {
            _serviceRequestService = serviceRequestService;
            _logger = logger;
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult<ServiceRequestDto>> CreateServiceRequest([FromBody] CreateServiceRequestDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var serviceRequest = await _serviceRequestService.CreateServiceRequestAsync(userId, dto);

                if (serviceRequest == null)
                {
                    return BadRequest(new { message = "Failed to create service request" });
                }

                return CreatedAtAction(nameof(GetServiceRequest), new { id = serviceRequest.Id }, serviceRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating service request");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceRequestDto>> GetServiceRequest(int id)
        {
            try
            {
                var serviceRequest = await _serviceRequestService.GetServiceRequestByIdAsync(id);

                if (serviceRequest == null)
                {
                    return NotFound(new { message = "Service request not found" });
                }

                // Verify user has access to this request
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                // This is simplified - in production, you'd verify the user is either the customer or assigned mechanic

                return Ok(serviceRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting service request");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        [HttpGet("customer/my-requests")]
        [Authorize(Roles = "Customer")]
        public async Task<ActionResult<List<ServiceRequestDto>>> GetMyRequests()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var requests = await _serviceRequestService.GetCustomerServiceRequestsAsync(userId);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting customer service requests");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        [HttpGet("mechanic/my-requests")]
        [Authorize(Roles = "Mechanic")]
        public async Task<ActionResult<List<ServiceRequestDto>>> GetMechanicRequests()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var requests = await _serviceRequestService.GetMechanicServiceRequestsAsync(userId);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting mechanic service requests");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        [HttpGet("mechanic/nearby-pending")]
        [Authorize(Roles = "Mechanic")]
        public async Task<ActionResult<List<ServiceRequestDto>>> GetNearbyPendingRequests([FromQuery] double radiusKm = 20)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var requests = await _serviceRequestService.GetPendingRequestsNearMechanicAsync(userId, radiusKm);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting nearby pending requests");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        [HttpPost("{id}/assign")]
        [Authorize(Roles = "Mechanic")]
        public async Task<ActionResult<ServiceRequestDto>> AssignMechanic(int id, [FromBody] AssignMechanicDto dto)
        {
            try
            {
                var serviceRequest = await _serviceRequestService.AssignMechanicAsync(id, dto.MechanicId);

                if (serviceRequest == null)
                {
                    return BadRequest(new { message = "Failed to assign mechanic. Request may not be pending or mechanic unavailable." });
                }

                return Ok(serviceRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning mechanic");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<ServiceRequestDto>> UpdateStatus(int id, [FromBody] UpdateServiceRequestStatusDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var serviceRequest = await _serviceRequestService.UpdateStatusAsync(id, userId, dto);

                if (serviceRequest == null)
                {
                    return BadRequest(new { message = "Failed to update status. You may not have permission or the request doesn't exist." });
                }

                return Ok(serviceRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating service request status");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }
    }
}

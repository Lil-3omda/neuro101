using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Platform.Application.DTOs;
using Platform.Core.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Platform.Infrastructure.Data.DbContext;
using Microsoft.EntityFrameworkCore;
using Platform.Application.ServiceInterfaces;


namespace Platform.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IConfiguration _config;
        private readonly CourseDbContext _context;
        private readonly IOtpService _otpService;

        public AuthController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            IConfiguration config,
            CourseDbContext context,
            IOtpService otpService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
            _context = context;
            _otpService = otpService;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterStudentDto dto)
        {
            var user = new AppUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Address = dto.Address,
                Gender = dto.Gender
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await _userManager.AddToRoleAsync(user, "Student");

            // Create Student entry
            var student = new Student
            {
                UserId = user.Id,
                isBlocked = false,
                isDeleted = false
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Student registered successfully" });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return Unauthorized("Invalid credentials");

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded) return Unauthorized("Invalid credentials");

            // ❌ Don't return token here yet
            // Instead send OTP
            var otp = await _otpService.GenerateOtpAsync(user.Id, user.Email, $"{user.FirstName} {user.LastName}");

            return Ok(new { message = "OTP sent to email, please verify" });
        }


        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var student = _context.Students.FirstOrDefault(s => s.UserId == userId);
            if (student == null) return NotFound("Student not found");

            var user = await _userManager.FindByIdAsync(userId);

            var dto = new StudentDto
            {
                Id = student.Id,
                UserId = student.UserId,
                FullName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                ProfilePicture = user.ProfilePicture,
                Address = user.Address,
                Gender = user.Gender,
                IsBlocked = student.isBlocked,
                IsDeleted = student.isDeleted
            };

            return Ok(dto);
        }

        private async Task<string> GenerateJwtToken(AppUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // Add role claims
            claims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }



        [HttpGet("check-email")]
        public async Task<IActionResult> CheckEmail([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email is required.");

            var user = await _userManager.FindByEmailAsync(email);
            var exists = user != null;

            return Ok(new { email, exists });
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromQuery] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("User not found");

            var otp = await _otpService.GenerateOtpAsync(user.Id, user.Email, $"{user.FirstName} {user.LastName}");
            return Ok(new { message = "OTP sent to email" });
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromQuery] string email, [FromQuery] string code)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("User not found");

            var isValid = await _otpService.ValidateOtpAsync(user.Id, code);
            if (!isValid) return BadRequest("Invalid or expired OTP");

            // ✅ Generate JWT token after successful OTP verification
            var token = await GenerateJwtToken(user); 

            return Ok(new
            {
                message = "OTP verified successfully",
                token
            });
        }

    }
}

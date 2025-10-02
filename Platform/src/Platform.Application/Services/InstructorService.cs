using Platform.Application.DTOs;
using Platform.Core.DTOs;
using Platform.Core.Interfaces;
using Platform.Core.Interfaces.IRepos;
using Platform.Core.Models;

namespace Platform.Application.Services
{
    public class InstructorService : IInstructorService
    {
        private readonly IInstructorRepository _repository;

        public InstructorService(IInstructorRepository repository)
        {
            _repository = repository;
        }

        public async Task<(bool Succeeded, string Errors)> VerifyInstructorAsync(int id)
        {
            var instructor = await _repository.GetByIdAsync(id);
            if (instructor == null) return (false, "Instructor not found");

            instructor.IsVerified = true;
            await _repository.UpdateAsync(instructor);
            await _repository.SaveChangesAsync();

            return (true, null);
        }

        async public Task<(bool Succeeded, string Errors)> RegisterInstructorAsync(RegisterInstructorDto dto)
        {
            try
            {
                var instructor = new Instructor
                {
                    LinkedIn = dto.LinkedIn,
                    Qualifications = dto.Qualifications,
                    UserId = dto.UserId,
                    IsVerified = false
                };

                await _repository.AddAsync(instructor);
                await _repository.SaveChangesAsync();
                return (true, null);
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }

        async Task<InstructorDto> IInstructorService.GetInstructorByIdAsync(int id)
        {
            var instructor = await _repository.GetByIdAsync(id);
            if (instructor == null) return null;

            return new InstructorDto
            {
                Id = instructor.Id,
                LinkedIn = instructor.LinkedIn,
                Qualifications = instructor.Qualifications,
                IsVerified = instructor.IsVerified,
                UserId = instructor.UserId,
                FullName = $"{instructor.User.FirstName} {instructor.User.LastName}",
                Email = instructor.User.Email,
                Courses = instructor.Courses?.Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description
                }).ToList()
            };
        }

        async Task<IEnumerable<InstructorDto>> IInstructorService.GetAllInstructorsAsync()
        {
            var instructors = await _repository.GetAllAsync();
            return instructors.Select(i => new InstructorDto
            {
                Id = i.Id,
                LinkedIn = i.LinkedIn,
                Qualifications = i.Qualifications,
                IsVerified = i.IsVerified,
                UserId = i.UserId,
                FullName = $"{i.User.FirstName} {i.User.LastName}",
                Email = i.User.Email,
                Courses = i.Courses?.Select(c => new CourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description
                }).ToList()
            });
        }
    }
}

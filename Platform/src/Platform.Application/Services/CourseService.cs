using Platform.Application.DTOs;
using Platform.Application.IRepos;
using Platform.Application.ServiceInterfaces;
using Platform.Core.DTOs;
using Platform.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Platform.Application.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _repo;
        public CourseService(ICourseRepository repo) => _repo = repo;

        private CourseDetailsDto MapToDto(Courses c)
        {
            return new CourseDetailsDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                ThumbnailUrl = c.ThumbnailUrl,
                Price = c.Price,
                IsFree = c.IsFree,
                CreatedAt = c.CreatedAt,
                CategoryId = c.CategoryId,
                InstructorId = c.InstructorId,
                CategoryName = c.Category?.Name,
                InstructorName = c.Instructor?.User?.ToString() // adjust if Instructor.User has Name field
            };
        }

        public async Task<IEnumerable<CourseDetailsDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(MapToDto);
        }

        public async Task<CourseDetailsDto?> GetByIdAsync(int id)
        {
            var c = await _repo.GetByIdAsync(id);
            return c == null ? null : MapToDto(c);
        }

        public async Task<CourseDetailsDto> CreateAsync(CourseCreateDto dto)
        {
            var entity = new Courses
            {
                Title = dto.Title,
                Description = dto.Description,
                ThumbnailUrl = dto.ThumbnailUrl,
                Price = dto.Price,
                IsFree = dto.IsFree,
                CategoryId = dto.CategoryId,
                InstructorId = dto.InstructorId
            };

            var created = await _repo.AddAsync(entity);
            return MapToDto(created);
        }

        public async Task<bool> UpdateAsync(int id, CourseUpdateDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;

            existing.Title = dto.Title;
            existing.Description = dto.Description;
            existing.ThumbnailUrl = dto.ThumbnailUrl;
            existing.Price = dto.Price;
            existing.IsFree = dto.IsFree;
            existing.CategoryId = dto.CategoryId;
            existing.InstructorId = dto.InstructorId;

            await _repo.UpdateAsync(existing);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;
            await _repo.DeleteAsync(existing);
            return true;
        }
    }
}

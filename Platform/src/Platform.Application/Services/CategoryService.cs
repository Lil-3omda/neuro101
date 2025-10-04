using Platform.Application.DTOs;
using Platform.Application.IRepos;
using Platform.Application.ServiceInterfaces;
using Platform.Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Platform.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repo;

        public CategoryService(ICategoryRepository repo) => _repo = repo;

        private CategoryDetailsDto MapToDto(Category c)
        {
            return new CategoryDetailsDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            };
        }

        public async Task<IEnumerable<CategoryDetailsDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(MapToDto);
        }

        public async Task<CategoryDetailsDto?> GetByIdAsync(int id)
        {
            var category = await _repo.GetByIdAsync(id);
            return category == null ? null : MapToDto(category);
        }

        public async Task<CategoryDetailsDto> CreateAsync(CategoryCreateDto dto)
        {
            var entity = new Category
            {
                Name = dto.Name,
                Description = dto.Description
            };

            var created = await _repo.AddAsync(entity);
            return MapToDto(created);
        }

        public async Task<bool> UpdateAsync(int id, CategoryUpdateDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return false;

            existing.Name = dto.Name;
            existing.Description = dto.Description;

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

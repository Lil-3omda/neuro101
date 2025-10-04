using Platform.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Platform.Application.ServiceInterfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDetailsDto>> GetAllAsync();
        Task<CategoryDetailsDto?> GetByIdAsync(int id);
        Task<CategoryDetailsDto> CreateAsync(CategoryCreateDto dto);
        Task<bool> UpdateAsync(int id, CategoryUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}

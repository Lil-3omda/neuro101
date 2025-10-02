using Platform.Application.DTOs;
using Platform.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Platform.Application.ServiceInterfaces
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseDetailsDto>> GetAllAsync();
        Task<CourseDetailsDto?> GetByIdAsync(int id);
        Task<CourseDetailsDto> CreateAsync(CourseCreateDto dto);
        Task<bool> UpdateAsync(int id, CourseUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}

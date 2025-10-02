using Platform.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Platform.Application.IRepos
{
    public interface ICourseRepository 

    {
        Task<IEnumerable<Courses>> GetAllAsync();
        Task<Courses?> GetByIdAsync(int id);
        Task<Courses> AddAsync(Courses course);
        Task UpdateAsync(Courses course);
        Task DeleteAsync(Courses course);
        Task<bool> ExistsAsync(int id);
    }
}

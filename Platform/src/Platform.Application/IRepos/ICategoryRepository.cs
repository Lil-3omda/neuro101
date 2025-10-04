using Platform.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Platform.Application.IRepos
{

        public interface ICategoryRepository
        {
            Task<IEnumerable<Category>> GetAllAsync();
            Task<Category?> GetByIdAsync(int id);
            Task<Category> AddAsync(Category category);
            Task UpdateAsync(Category category);
            Task DeleteAsync(Category category);
            Task<bool> ExistsAsync(int id);
        
    }

}

using Microsoft.EntityFrameworkCore;
using Platform.Application.IRepos;
using Platform.Core.Models;
using Platform.Infrastructure.Data.DbContext;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Platform.Infrastructure.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly CourseDbContext _db;
        public CategoryRepository(CourseDbContext db) => _db = db;

        public async Task<IEnumerable<Category>> GetAllAsync()
        {

            return await _db.Categories
                            .Include(c => c.Courses)
                            .ToListAsync();
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _db.Categories
                            .Include(c => c.Courses)
                            .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Category> AddAsync(Category category)
        {
            var entity = (await _db.Categories.AddAsync(category)).Entity;
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(Category category)
        {
            _db.Categories.Update(category);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(Category category)
        {
            _db.Categories.Remove(category);
            await _db.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _db.Categories.AnyAsync(c => c.Id == id);
        }
    }
}

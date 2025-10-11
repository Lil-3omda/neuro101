using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Platform.Application.IRepos;
using Platform.Core.Models;
using Platform.Infrastructure.Data.DbContext;

namespace Platform.Infrastructure.Repositories
{
    public class VideoRepository : GenericRepository<Video>, IVedioRepository
    {
        public VideoRepository(CourseDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Video>> GetVideosWithCourse()
        {
            return await _context.Videos
                .Include(v => v.Module)
                .ThenInclude(m => m.Course)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}

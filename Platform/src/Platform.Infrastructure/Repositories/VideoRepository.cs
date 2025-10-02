using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
    }
}

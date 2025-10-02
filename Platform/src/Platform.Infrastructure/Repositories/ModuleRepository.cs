using Platform.Application.IRepos;
using Platform.Core.Interfaces.IRepos;
using Platform.Infrastructure.Data.DbContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Platform.Infrastructure.Repositories
{
    public class ModuleRepository : GenericRepository<Platform.Core.Models.Module>, IModuleRepository
    {
        private readonly CourseDbContext dbContext;

        public ModuleRepository(CourseDbContext dbContext ):base(dbContext)
        {
            this.dbContext = dbContext;
        }



      

       

        //public Task<IEnumerable<Module>> GetAllAsync()
        //{
        //    throw new NotImplementedException();
        //}

        //public Task<Module?> GetByIdAsync(int id)
        //{
        //    throw new NotImplementedException();
        //}

        //public void Update(Module entity)
        //{
        //    throw new NotImplementedException();
        //}
    }
}

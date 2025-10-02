using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Platform.Application.DTOs;
using Platform.Application.ServiceInterfaces;
using Platform.Core.Models;
using Platform.Infrastructure.Data.DbContext;
using Platform.Infrastructure.UnitOfWork;
using System.Reflection;
using System.Threading.Tasks;

namespace Platform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModuleController : ControllerBase
    {
        private readonly CourseDbContext courseDbContext;
        private readonly IModuleService moduleService;

        public ModuleController(CourseDbContext courseDbContext , IModuleService moduleService )
        {
            this.courseDbContext = courseDbContext;
            this.moduleService = moduleService;
        }


        //GetAllModuleS

        [HttpGet]
        public async Task<IActionResult> GetAllModules()
        {

            IEnumerable<ModulesDTO> modules =await moduleService.GetAllModules();
            return Ok(modules);

        }




        //GetModuleByID

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAllModules(int id)
        {
            ModulesDTO module = await moduleService.GetModulesById(id);

            return Ok(module);

        }


        //Add Module

        [HttpPost]
        public async Task<IActionResult> AddModule(AddModuleDTO module)
        {

            await  moduleService.AddModule(module);
            return Ok(new {message="Module Added Successfully"});

        }



        //Edit Module

        [HttpPut]
        public async Task<IActionResult> EditModule(AddModuleDTO modulesDTO)
        {
            await moduleService.UpdateModule(modulesDTO);
            return Ok(new { message = "Module Updated Successfully" });

        }


        //Delete Module

        [HttpDelete]
        public async Task<IActionResult> DeleteModule(int id)
        {

            await moduleService.DeleteModule(id);
            
            return Ok(new { message = "Module Deleted Successfully" });
        }

    }
}

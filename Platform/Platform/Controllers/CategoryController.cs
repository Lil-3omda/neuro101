using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Platform.Core.Interfaces.IRepos;
using Platform.Core.Interfaces.IUnitOfWork;
using Platform.Core.Models;
using Platform.Infrastructure.Data.DbContext;
using Platform.Infrastructure.Repositories;


namespace Platform.Controllers
{ 
[Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllCategories([FromServices] IUnitOfWork unitOfWork)
        {
            var categoryRepo = unitOfWork.Repository<Category>();
            var categories = await categoryRepo.GetAllAsync();
            return Ok(categories);
        }
        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetCategoryById(int id, [FromServices] IUnitOfWork unitOfWork)
        {
            var categoryRepo = unitOfWork.Repository<Category>();
            var category = await categoryRepo.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] Category category, [FromServices] IUnitOfWork unitOfWork)
        {
            var categoryRepo = unitOfWork.Repository<Category>();
            await categoryRepo.AddAsync(category);
            await unitOfWork.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
        }
        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category, [FromServices] IUnitOfWork unitOfWork)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }
            var categoryRepo = unitOfWork.Repository<Category>();
            var existingCategory = await categoryRepo.GetByIdAsync(id);
            if (existingCategory == null)
            {
                return NotFound();
            }
            existingCategory.Name = category.Name;
            categoryRepo.Update(existingCategory);
            await unitOfWork.SaveChangesAsync();
            return NoContent();
        }
    }
}
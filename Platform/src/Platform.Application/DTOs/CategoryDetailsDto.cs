using Platform.Core.DTOs;
using System.Collections.Generic;

namespace Platform.Application.DTOs
{
    public class CategoryDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        

        public List<CourseDto>? Courses { get; set; }
    }
}

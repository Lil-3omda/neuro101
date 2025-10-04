using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Platform.Application.DTOs;
using Platform.Application.ServiceInterfaces;
using Platform.Core.Interfaces.IUnitOfWork;
using Platform.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Platform.Application.Services
{
    public class ModuleService : IModuleService
    {
        private readonly IUnitOfWork unitOfWork;

        public ModuleService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }


        public async Task AddModule(AddModuleDTO addModuleDTO)
        {
            await unitOfWork.moduleRepository.AddAsync(new Platform.Core.Models.Module()
            {
                Title = addModuleDTO.Title,
                ModuleArrangement = addModuleDTO.ModuleArrangement,
                CourseId = addModuleDTO.CourseId

           });

            await unitOfWork.SaveChangesAsync();
        
        }




        public async Task DeleteModule(int id)
        {
           await  unitOfWork.moduleRepository.Delete(id);
           await unitOfWork.SaveChangesAsync();
        }



        public async Task<IEnumerable<ModulesDTO>?> GetAllModules()
        {
            IEnumerable<Platform.Core.Models.Module> modules = await unitOfWork.moduleRepository.GetAllAsync();

            if (modules == null || !modules.Any())
            {
                return null;
            }

            return modules.Select(module => new ModulesDTO()
            {
                Id = module.Id,
                Title = module.Title,
                ModuleArrangement = module.ModuleArrangement,
                CourseId = module.CourseId,
                Course = new EnrolledCoursesDTO()
                {
                    Title = module?.Course?.Title ?? "",
                    Description = module?.Course?.Description ?? "",
                    Id = module?.Course?.Id ?? 0,
                    InstructorId = module?.Course?.InstructorId ?? 0,
                    IsFree = module?.Course?.IsFree ?? false,
                    Price = module?.Course?.Price ?? 0,
                    ThumbnailUrl = module?.Course?.ThumbnailUrl ?? ""
                },
                Videos = module?.Videos?.Select(v => new VideoDto
                {
                    Id = v.Id,
                    Title = v.Title,
                    FilePath = v.FilePath,
                    Duration = v.Duration,
                    VideoArrangement = v.VideoArrangement
                }).ToList() ?? new List<VideoDto>()
            });
        }


        public async Task<ModulesDTO?> GetModulesById(int id)
        {
            Platform.Core.Models.Module?  module = await unitOfWork.moduleRepository.GetByIdAsync(id);

            if(module == null)
            {
                return null;
            }

            else
            {

                ModulesDTO moduleDTO = new ModulesDTO()
                {
                    Id = module.Id,
                    Title = module.Title,
                    ModuleArrangement = module.ModuleArrangement,
                    CourseId = module.CourseId,
                    Course = new EnrolledCoursesDTO()
                    {
                        Title = module?.Course?.Title??"",
                        Description = module?.Course?.Description??"",
                        Id = module?.Course?.Id ?? 0,
                        InstructorId = module?.Course?.InstructorId ??0,
                        IsFree = module?.Course?.IsFree??false,
                        Price = module?.Course?.Price??0,
                        ThumbnailUrl = module?.Course?.ThumbnailUrl ?? ""


                    },

                    Videos = module?.Videos?.Select(v => new VideoDto
                    {
                        Id = v.Id,
                        Title = v.Title,
                        FilePath = v.FilePath,
                        Duration = v.Duration,
                        VideoArrangement = v.VideoArrangement
                    }).ToList() ?? new List<VideoDto>()

                };

                return moduleDTO;

            }

        }


        public async Task UpdateModule(AddModuleDTO addModuleDTO)
        {
            unitOfWork.moduleRepository.Update(new Platform.Core.Models.Module()
            {
                Title = addModuleDTO.Title,
                Id=addModuleDTO.Id,
                ModuleArrangement=addModuleDTO.ModuleArrangement,
                CourseId=addModuleDTO.CourseId
            });

           await unitOfWork.SaveChangesAsync();


           


        }
    }
}

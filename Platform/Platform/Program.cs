
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Platform.Application.IRepos;
using Platform.Application.ServiceInterfaces;
using Platform.Application.Services;
using Platform.Core.Interfaces;
using Platform.Core.Interfaces.IRepos;
using Platform.Core.Models;
using Platform.Infrastructure.Data.DbContext;
using Platform.Infrastructure.Repositories;

using Platform.Core.Interfaces.IUnitOfWork;
using Platform.Infrastructure.UnitOfWork;
using Microsoft.AspNetCore.Http.Features;
using Xabe.FFmpeg;
using Xabe.FFmpeg.Downloader;
using System.Text;


namespace Platform
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // DbContext
            builder.Services.AddDbContext<CourseDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Identity
            builder.Services.AddIdentity<AppUser, IdentityRole>()
                .AddEntityFrameworkStores<CourseDbContext>()
                .AddDefaultTokenProviders();
            builder.Services.AddScoped<IUnitOfWork, UnitOFWork>();
            builder.Services.AddScoped<IInstructorRepository, InstructorRepository>();
            builder.Services.AddScoped<IInstructorService, InstructorService>();
            builder.Services.AddMemoryCache();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IOtpService, OtpService>();

            builder.Services.AddScoped<IFileService, FileService>();
            builder.Services.AddScoped<IVideoService, VideoService>();
            builder.Services.AddScoped<IUnitOfWork, UnitOFWork>();
            builder.Services.AddScoped<IEnrollmentService , EnrollmentService>();   
            builder.Services.AddScoped<IModuleService,ModuleService>();

            builder.WebHost.ConfigureKestrel(options =>
            {
                options.Limits.MaxRequestBodySize = long.MaxValue; // Unlimited (or set a size in bytes)
            });


            // ? Allow large file uploads globally
            builder.Services.Configure<FormOptions>(options =>
            {
                options.ValueLengthLimit = int.MaxValue;              // Max length of each form value
                options.MultipartBodyLengthLimit = long.MaxValue;     // Allow very large files
                options.MultipartHeadersLengthLimit = int.MaxValue;   // Headers limit
                options.KeyLengthLimit = int.MaxValue;                // Form key size
                options.ValueCountLimit = int.MaxValue;               // Max items in form
            });
            builder.Services.AddScoped<ICourseRepository, CourseRepository>();
            builder.Services.AddScoped<ICourseService, CourseService>();
            


            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            // Swagger
            builder.Services.AddOpenApi();
            // ⚡ FFmpeg setup before building the app
            var ffmpegPath = Path.Combine(AppContext.BaseDirectory, "FFmpeg");
            if (!Directory.Exists(ffmpegPath))
            {
                Directory.CreateDirectory(ffmpegPath);
                await FFmpegDownloader.GetLatestVersion(FFmpegVersion.Official, ffmpegPath);
            }
            FFmpeg.SetExecutablesPath(ffmpegPath);

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/openapi/v1.json", "Nuero API v1");
                });
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseStaticFiles();

            app.MapControllers();

            app.Run();
        }
    }
}

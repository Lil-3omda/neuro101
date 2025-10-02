using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Platform.Application.ServiceInterfaces;
using Xabe.FFmpeg;

namespace Platform.Application.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;

        private readonly string[] _allowedVideoTypes = { ".mp4", ".mov", ".avi", ".mkv", ".webm" };

        public FileService(IWebHostEnvironment env)
        {
            _env = env;

            if (string.IsNullOrEmpty(_env.WebRootPath))
            {
                // Set a default wwwroot path if it's missing
                _env.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                if (!Directory.Exists(_env.WebRootPath))
                    Directory.CreateDirectory(_env.WebRootPath);
            }
        }

        public async Task<string> UploadVideoAsync(IFormFile file, string folderName = "videos")
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file uploaded.");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedVideoTypes.Contains(extension))
                throw new ArgumentException("Invalid video format. Allowed: mp4, mov, avi, mkv, webm");

            if (file.Length > 1024L * 1024L * 1024L) // 100 MB limit
                throw new ArgumentException("Video file is too large (max 100 MB).");

            // wwwroot/uploads/videos
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", folderName);

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return relative path for DB
            return $"/uploads/{folderName}/{fileName}";
        }

        public void DeleteFile(string fileUrl)
        {
            if (string.IsNullOrEmpty(fileUrl)) return;

            var filePath = Path.Combine(_env.WebRootPath, fileUrl.TrimStart('/'));
            if (File.Exists(filePath))
            {
                try
                {
                    File.Delete(filePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error deleting file {filePath}: {ex.Message}");
                }
            }
        }

        public async Task<int> GetVideoDurationAsync(string fileUrl)
        {
            // Convert relative URL (/uploads/...) to actual physical path
            var absolutePath = Path.Combine(_env.WebRootPath, fileUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));

            if (!File.Exists(absolutePath))
                throw new FileNotFoundException($"Video file not found at path: {absolutePath}");

            var mediaInfo = await FFmpeg.GetMediaInfo(absolutePath);
            var videoStream = mediaInfo.VideoStreams.FirstOrDefault();

            return videoStream == null ? 0 : (int)videoStream.Duration.TotalSeconds;
        }

    }
}

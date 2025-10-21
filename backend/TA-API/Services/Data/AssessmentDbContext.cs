using Microsoft.EntityFrameworkCore;
using TA_API.DataSeed;
using TA_API.Models;

namespace TA_API.Services.Data
{
    public class AssessmentDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Person> People { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BookLoan> BookLoans { get; set; }
        
        public AssessmentDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Seed the data
            DataSeedDB.Seed(modelBuilder);
        }
    }
}

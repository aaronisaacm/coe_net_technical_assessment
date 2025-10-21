using Microsoft.EntityFrameworkCore;
using TA_API.Models;
using TA_API.Services.Data;

namespace TA_API.Repositories
{
    public interface IPersonRepository : IGenericRepository<Person>
    {
        Task<Person?> GetPersonByNameAsync(string name, string lastName);
        Task<IEnumerable<Person>> SearchByNameAsync(string searchTerm);
    }

    public class PersonRepository : GenericRepository<Person>, IPersonRepository
    {
        public PersonRepository(AssessmentDbContext context) : base(context)
        {
        }

        public async Task<Person?> GetPersonByNameAsync(string name, string lastName)
        {
            return await _dbSet
                .FirstOrDefaultAsync(p => p.Name == name && p.LastName == lastName);
        }

        public async Task<IEnumerable<Person>> SearchByNameAsync(string searchTerm)
        {
            return await _dbSet
                .Where(p => p.Name.Contains(searchTerm) || p.LastName.Contains(searchTerm))
                .ToListAsync();
        }
    }
}


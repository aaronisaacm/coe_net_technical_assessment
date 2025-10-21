using Microsoft.EntityFrameworkCore;
using TA_API.Models;
using TA_API.Services.Data;

namespace TA_API.Repositories
{
    public interface IBookRepository : IGenericRepository<Book>
    {
        Task<IEnumerable<Book>> GetBooksByAuthorAsync(string author);
        Task<Book?> GetBookByNameAsync(string bookName);
    }

    public class BookRepository : GenericRepository<Book>, IBookRepository
    {
        public BookRepository(AssessmentDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Book>> GetBooksByAuthorAsync(string author)
        {
            return await _dbSet
                .Where(b => b.Author.Contains(author))
                .ToListAsync();
        }

        public async Task<Book?> GetBookByNameAsync(string bookName)
        {
            return await _dbSet
                .FirstOrDefaultAsync(b => b.BookName == bookName);
        }
    }
}


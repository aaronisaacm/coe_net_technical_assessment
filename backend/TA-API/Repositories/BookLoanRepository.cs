using Microsoft.EntityFrameworkCore;
using TA_API.Models;
using TA_API.Services.Data;

namespace TA_API.Repositories
{
    public interface IBookLoanRepository : IGenericRepository<BookLoan>
    {
        Task<IEnumerable<BookLoan>> GetAllWithDetailsAsync();
        Task<IEnumerable<BookLoan>> GetActiveLoansByPersonIdAsync(int PersonId);
        Task<IEnumerable<BookLoan>> GetActiveLoansByBookIdAsync(int bookId);
        Task<IEnumerable<BookLoan>> GetOverdueLoansAsync();
        Task<IEnumerable<BookLoan>> GetLoanHistoryByPersonIdAsync(int PersonId);
        Task<BookLoan?> GetLoanWithDetailsAsync(int loanId);
        Task<bool> ReturnBookAsync(int loanId, DateTime returnDate);
        Task<bool> IsBookReturnedAsync(int loanId);
        Task<IEnumerable<BookLoan>> GetReturnedLoansAsync();
        Task<bool> IsBookAvailableAsync(int bookId);
    }

    public class BookLoanRepository : GenericRepository<BookLoan>, IBookLoanRepository
    {
        public BookLoanRepository(AssessmentDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<BookLoan>> GetAllWithDetailsAsync()
        {
            return await _dbSet
                .Include(bl => bl.Book)
                .Include(bl => bl.Person)
                .ToListAsync();
        }

        public async Task<IEnumerable<BookLoan>> GetActiveLoansByPersonIdAsync(int PersonId)
        {
            return await _dbSet
                .Include(bl => bl.Book)
                .Include(bl => bl.Person)
                .Where(bl => bl.PersonId == PersonId && !bl.IsReturned)
                .ToListAsync();
        }

        public async Task<IEnumerable<BookLoan>> GetActiveLoansByBookIdAsync(int bookId)
        {
            return await _dbSet
                .Include(bl => bl.Book)
                .Include(bl => bl.Person)
                .Where(bl => bl.BookId == bookId && !bl.IsReturned)
                .ToListAsync();
        }

        public async Task<IEnumerable<BookLoan>> GetOverdueLoansAsync()
        {
            return await _dbSet
                .Include(bl => bl.Book)
                .Include(bl => bl.Person)
                .Where(bl => !bl.IsReturned && bl.DueDate < DateTime.Now)
                .ToListAsync();
        }

        public async Task<IEnumerable<BookLoan>> GetLoanHistoryByPersonIdAsync(int PersonId)
        {
            return await _dbSet
                .Include(bl => bl.Book)
                .Include(bl => bl.Person)
                .Where(bl => bl.PersonId == PersonId)
                .OrderByDescending(bl => bl.LoanDate)
                .ToListAsync();
        }

        public async Task<BookLoan?> GetLoanWithDetailsAsync(int loanId)
        {
            return await _dbSet
                .Include(bl => bl.Book)
                .Include(bl => bl.Person)
                .FirstOrDefaultAsync(bl => bl.BookLoanId == loanId);
        }

        public async Task<bool> ReturnBookAsync(int loanId, DateTime returnDate)
        {
            var loan = await GetByIdAsync(loanId);
            if (loan == null || loan.IsReturned)
                return false;

            loan.ReturnDate = returnDate;
            loan.IsReturned = true;
            await SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsBookReturnedAsync(int loanId)
        {
            var loan = await GetByIdAsync(loanId);
            return loan?.IsReturned ?? false;
        }

        public async Task<IEnumerable<BookLoan>> GetReturnedLoansAsync()
        {
            return await _dbSet
                .Include(bl => bl.Book)
                .Include(bl => bl.Person)
                .Where(bl => bl.IsReturned)
                .OrderByDescending(bl => bl.ReturnDate)
                .ToListAsync();
        }

        public async Task<bool> IsBookAvailableAsync(int bookId)
        {
            var activeLoans = await _dbSet
                .Where(bl => bl.BookId == bookId && !bl.IsReturned)
                .AnyAsync();
            
            return !activeLoans;
        }
    }
}


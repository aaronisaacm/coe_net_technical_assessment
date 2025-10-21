using Microsoft.EntityFrameworkCore;
using TA_API.Services.Data;

namespace TA_API.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly AssessmentDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(AssessmentDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await SaveChangesAsync();
            return entity;
        }

        public virtual async Task<T> UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await SaveChangesAsync();
            return entity;
        }

        public virtual async Task<bool> DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null)
                return false;

            _dbSet.Remove(entity);
            await SaveChangesAsync();
            return true;
        }

        public virtual async Task<bool> ExistsAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            return entity != null;
        }

        public virtual async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}


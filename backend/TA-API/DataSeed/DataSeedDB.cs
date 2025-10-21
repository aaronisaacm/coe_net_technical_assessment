using Microsoft.EntityFrameworkCore;
using TA_API.Models;

namespace TA_API.DataSeed
{
    public static class DataSeedDB
    {
        public static void Seed(this ModelBuilder modelBuilder)
        {
                // Configure User Entity
            modelBuilder.Entity<Person>(entity =>
            {
                entity.HasKey(x => x.PersonId);
                entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
                entity.Property(x => x.LastName).IsRequired().HasMaxLength(100);

                // Seed Users
                entity.HasData(
                    new Person { PersonId = 1, Name = "Aaron", LastName = "Isaac" },
                    new Person { PersonId = 2, Name = "John", LastName = "Smith" },
                    new Person { PersonId = 3, Name = "Emma", LastName = "Johnson" },
                    new Person { PersonId = 4, Name = "Michael", LastName = "Williams" },
                    new Person { PersonId = 5, Name = "Sarah", LastName = "Brown" }
                );
            });

            // Configure Book Entity
            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasKey(x => x.BookId);
                entity.Property(x => x.Author).IsRequired().HasMaxLength(100);
                entity.Property(x => x.Description).IsRequired().HasMaxLength(500);
                entity.Property(x => x.BookName).IsRequired().HasMaxLength(200);

                // Seed Books
                entity.HasData(
                    new Book 
                    { 
                        BookId = 1, 
                        BookName = "Clean Code", 
                        Author = "Robert C. Martin", 
                        Description = "A handbook of agile software craftsmanship" 
                    },
                    new Book 
                    { 
                        BookId = 2, 
                        BookName = "Design Patterns", 
                        Author = "Gang of Four", 
                        Description = "Elements of reusable object-oriented software" 
                    },
                    new Book 
                    { 
                        BookId = 3, 
                        BookName = "The Pragmatic Programmer", 
                        Author = "Andrew Hunt, David Thomas", 
                        Description = "Your journey to mastery" 
                    },
                    new Book 
                    { 
                        BookId = 4, 
                        BookName = "Refactoring", 
                        Author = "Martin Fowler", 
                        Description = "Improving the design of existing code" 
                    },
                    new Book 
                    { 
                        BookId = 5, 
                        BookName = "The Mythical Man-Month", 
                        Author = "Frederick Brooks", 
                        Description = "Essays on software engineering" 
                    },
                    new Book 
                    { 
                        BookId = 6, 
                        BookName = "Code Complete", 
                        Author = "Steve McConnell", 
                        Description = "A practical handbook of software construction" 
                    },
                    new Book 
                    { 
                        BookId = 7, 
                        BookName = "Domain-Driven Design", 
                        Author = "Eric Evans", 
                        Description = "Tackling complexity in the heart of software" 
                    },
                    new Book 
                    { 
                        BookId = 8, 
                        BookName = "Introduction to Algorithms", 
                        Author = "Thomas H. Cormen", 
                        Description = "Comprehensive algorithms textbook" 
                    }
                );
            });

            // Configure BookLoan Entity
            modelBuilder.Entity<BookLoan>(entity =>
            {
                entity.HasKey(x => x.BookLoanId);
                entity.Property(x => x.LoanDate).IsRequired();
                entity.Property(x => x.DueDate).IsRequired();
                entity.Property(x => x.IsReturned).IsRequired();

                // Configure relationships
                entity.HasOne(x => x.Person)
                    .WithMany()
                    .HasForeignKey(x => x.PersonId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.Book)
                    .WithMany()
                    .HasForeignKey(x => x.BookId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Seed BookLoans
                entity.HasData(
                    // Active Loans (not returned yet)
                    new BookLoan 
                    { 
                        BookLoanId = 1, 
                        PersonId = 1, 
                        BookId = 1, 
                        LoanDate = new DateTime(2025, 10, 1), 
                        DueDate = new DateTime(2025, 10, 29),
                        ReturnDate = null,
                        IsReturned = false 
                    },
                    new BookLoan 
                    { 
                        BookLoanId = 2, 
                        PersonId = 2, 
                        BookId = 3, 
                        LoanDate = new DateTime(2025, 10, 5), 
                        DueDate = new DateTime(2025, 11, 2),
                        ReturnDate = null,
                        IsReturned = false 
                    },
                    new BookLoan 
                    { 
                        BookLoanId = 3, 
                        PersonId = 3, 
                        BookId = 5, 
                        LoanDate = new DateTime(2025, 10, 10), 
                        DueDate = new DateTime(2025, 11, 7),
                        ReturnDate = null,
                        IsReturned = false 
                    },
                    // Returned Loans (historical data)
                    new BookLoan 
                    { 
                        BookLoanId = 4, 
                        PersonId = 1, 
                        BookId = 2, 
                        LoanDate = new DateTime(2025, 9, 1), 
                        DueDate = new DateTime(2025, 9, 29),
                        ReturnDate = new DateTime(2025, 9, 25),
                        IsReturned = true 
                    },
                    new BookLoan 
                    { 
                        BookLoanId = 5, 
                        PersonId = 4, 
                        BookId = 4, 
                        LoanDate = new DateTime(2025, 9, 10), 
                        DueDate = new DateTime(2025, 10, 8),
                        ReturnDate = new DateTime(2025, 10, 5),
                        IsReturned = true 
                    },
                    new BookLoan 
                    { 
                        BookLoanId = 6, 
                        PersonId = 5, 
                        BookId = 6, 
                        LoanDate = new DateTime(2025, 8, 15), 
                        DueDate = new DateTime(2025, 9, 12),
                        ReturnDate = new DateTime(2025, 9, 10),
                        IsReturned = true 
                    },
                    new BookLoan 
                    { 
                        BookLoanId = 7, 
                        PersonId = 2, 
                        BookId = 7, 
                        LoanDate = new DateTime(2025, 8, 20), 
                        DueDate = new DateTime(2025, 9, 17),
                        ReturnDate = new DateTime(2025, 9, 15),
                        IsReturned = true 
                    },
                    // Overdue Loan
                    new BookLoan 
                    { 
                        BookLoanId = 8, 
                        PersonId = 4, 
                        BookId = 8, 
                        LoanDate = new DateTime(2025, 9, 15), 
                        DueDate = new DateTime(2025, 10, 13),
                        ReturnDate = null,
                        IsReturned = false 
                    }
                );
            });
        }
    }
}
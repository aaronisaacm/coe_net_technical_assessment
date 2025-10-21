using TA_API.DTOs;
using TA_API.Models;

namespace TA_API.Mappings
{
    public static class MappingExtensions
    {
        // Book mappings
        public static BookDto ToDto(this Book book)
        {
            return new BookDto
            {
                BookId = book.BookId,
                BookName = book.BookName,
                Description = book.Description,
                Author = book.Author
            };
        }

        public static IEnumerable<BookDto> ToDto(this IEnumerable<Book> books)
        {
            return books.Select(b => b.ToDto());
        }

        public static PersonDto ToDto(this Person person)
        {
            return new PersonDto
            {
                PersonId = person.PersonId,
                Name = person.Name,
                LastName = person.LastName
            };
        }

        public static IEnumerable<PersonDto> ToDto(this IEnumerable<Person> persons)
        {
            return persons.Select(p => p.ToDto());
        }

        public static BookLoanDto ToDto(this BookLoan bookLoan)
        {
            return new BookLoanDto
            {
                BookLoanId = bookLoan.BookLoanId,
                PersonId = bookLoan.PersonId,
                BookId = bookLoan.BookId,
                LoanDate = bookLoan.LoanDate,
                ReturnDate = bookLoan.ReturnDate,
                DueDate = bookLoan.DueDate,
                IsReturned = bookLoan.IsReturned,
                Person = bookLoan.Person?.ToDto(),
                Book = bookLoan.Book?.ToDto()
            };
        }
        public static IEnumerable<BookLoanDto> ToDto(this IEnumerable<BookLoan> bookLoans)
        {
            return bookLoans.Select(bl => bl.ToDto());
        }
    }
}


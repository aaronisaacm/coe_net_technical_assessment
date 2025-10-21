using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.BookLoans.Commands
{
    public class CreateBookLoanCommand : IRequest<BookLoanDto>
    {
        public int PersonId { get; set; }
        public int BookId { get; set; }
        public DateTime LoanDate { get; set; }
        public DateTime DueDate { get; set; }
    }
}

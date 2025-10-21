using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.BookLoans.Commands
{
    public class UpdateBookLoanCommand : IRequest<BookLoanDto>
    {
        public int BookLoanId { get; set; }
        public int PersonId { get; set; }
        public int BookId { get; set; }
        public DateTime LoanDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsReturned { get; set; }
    }
}

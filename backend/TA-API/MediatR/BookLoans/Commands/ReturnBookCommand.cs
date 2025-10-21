using MediatR;

namespace TA_API.MediatR.BookLoans.Commands
{
    public class ReturnBookCommand : IRequest<bool>
    {
        public int BookLoanId { get; set; }
        public DateTime ReturnDate { get; set; }
    }
}


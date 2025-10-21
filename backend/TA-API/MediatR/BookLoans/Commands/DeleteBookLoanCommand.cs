using MediatR;

namespace TA_API.MediatR.BookLoans.Commands
{
    public class DeleteBookLoanCommand : IRequest<bool>
    {
        public int BookLoanId { get; set; }
    }
}


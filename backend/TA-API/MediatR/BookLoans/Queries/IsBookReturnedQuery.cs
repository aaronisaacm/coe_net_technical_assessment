using MediatR;

namespace TA_API.MediatR.BookLoans.Queries
{
    public class IsBookReturnedQuery : IRequest<bool>
    {
        public int BookLoanId { get; set; }
    }
}


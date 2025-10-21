using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.BookLoans.Queries
{
    public class GetActiveLoansByBookQuery : IRequest<IEnumerable<BookLoanDto>>
    {
        public int BookId { get; set; }
    }
}

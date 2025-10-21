using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.BookLoans.Queries
{
    public class GetActiveLoansByPersonQuery : IRequest<IEnumerable<BookLoanDto>>
    {
        public int PersonId { get; set; }
    }
}

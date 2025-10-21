using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.BookLoans.Queries
{
    public class GetReturnedLoansQuery : IRequest<IEnumerable<BookLoanDto>>
    {
    }
}

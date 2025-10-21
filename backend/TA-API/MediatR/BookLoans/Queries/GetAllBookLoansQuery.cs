using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.BookLoans.Queries
{
    public class GetAllBookLoansQuery : IRequest<IEnumerable<BookLoanDto>>
    {
    }
}

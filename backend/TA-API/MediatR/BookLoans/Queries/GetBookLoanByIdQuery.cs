using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.BookLoans.Queries
{
    public class GetBookLoanByIdQuery : IRequest<BookLoanDto?>
    {
        public int BookLoanId { get; set; }
    }
}

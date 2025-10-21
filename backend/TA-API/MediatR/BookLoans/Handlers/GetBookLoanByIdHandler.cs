using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.BookLoans.Queries;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.BookLoans.Handlers
{
    public class GetBookLoanByIdHandler : IRequestHandler<GetBookLoanByIdQuery, BookLoanDto?>
    {
        private readonly IBookLoanRepository _bookLoanRepository;

        public GetBookLoanByIdHandler(IBookLoanRepository bookLoanRepository)
        {
            _bookLoanRepository = bookLoanRepository;
        }

        public async Task<BookLoanDto?> Handle(GetBookLoanByIdQuery request, CancellationToken cancellationToken)
        {
            var bookLoan = await _bookLoanRepository.GetLoanWithDetailsAsync(request.BookLoanId);
            return bookLoan?.ToDto();
        }
    }
}

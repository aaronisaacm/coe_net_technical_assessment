using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.BookLoans.Queries;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.BookLoans.Handlers
{
    public class GetOverdueLoansHandler : IRequestHandler<GetOverdueLoansQuery, IEnumerable<BookLoanDto>>
    {
        private readonly IBookLoanRepository _bookLoanRepository;

        public GetOverdueLoansHandler(IBookLoanRepository bookLoanRepository)
        {
            _bookLoanRepository = bookLoanRepository;
        }

        public async Task<IEnumerable<BookLoanDto>> Handle(GetOverdueLoansQuery request, CancellationToken cancellationToken)
        {
            var bookLoans = await _bookLoanRepository.GetOverdueLoansAsync();
            return bookLoans.ToDto();
        }
    }
}

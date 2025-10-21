using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.BookLoans.Queries;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.BookLoans.Handlers
{
    public class GetReturnedLoansHandler : IRequestHandler<GetReturnedLoansQuery, IEnumerable<BookLoanDto>>
    {
        private readonly IBookLoanRepository _bookLoanRepository;

        public GetReturnedLoansHandler(IBookLoanRepository bookLoanRepository)
        {
            _bookLoanRepository = bookLoanRepository;
        }

        public async Task<IEnumerable<BookLoanDto>> Handle(GetReturnedLoansQuery request, CancellationToken cancellationToken)
        {
            var bookLoans = await _bookLoanRepository.GetReturnedLoansAsync();
            return bookLoans.ToDto();
        }
    }
}

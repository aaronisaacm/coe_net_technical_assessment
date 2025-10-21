using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.BookLoans.Queries;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.BookLoans.Handlers
{
    public class GetActiveLoansByPersonHandler : IRequestHandler<GetActiveLoansByPersonQuery, IEnumerable<BookLoanDto>>
    {
        private readonly IBookLoanRepository _bookLoanRepository;

        public GetActiveLoansByPersonHandler(IBookLoanRepository bookLoanRepository)
        {
            _bookLoanRepository = bookLoanRepository;
        }

        public async Task<IEnumerable<BookLoanDto>> Handle(GetActiveLoansByPersonQuery request, CancellationToken cancellationToken)
        {
            var bookLoans = await _bookLoanRepository.GetActiveLoansByPersonIdAsync(request.PersonId);
            return bookLoans.ToDto();
        }
    }
}

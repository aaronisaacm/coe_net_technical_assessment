using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.BookLoans.Queries;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.BookLoans.Handlers
{
    public class GetAllBookLoansHandler : IRequestHandler<GetAllBookLoansQuery, IEnumerable<BookLoanDto>>
    {
        private readonly IBookLoanRepository _bookLoanRepository;

        public GetAllBookLoansHandler(IBookLoanRepository bookLoanRepository)
        {
            _bookLoanRepository = bookLoanRepository;
        }

        public async Task<IEnumerable<BookLoanDto>> Handle(GetAllBookLoansQuery request, CancellationToken cancellationToken)
        {
            var bookLoans = await _bookLoanRepository.GetAllWithDetailsAsync();
            return bookLoans.ToDto();
        }
    }
}

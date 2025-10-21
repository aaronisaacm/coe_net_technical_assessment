using MediatR;
using TA_API.MediatR.BookLoans.Queries;
using TA_API.Repositories;

namespace TA_API.MediatR.BookLoans.Handlers
{
    public class IsBookReturnedHandler : IRequestHandler<IsBookReturnedQuery, bool>
    {
        private readonly IBookLoanRepository _bookLoanRepository;

        public IsBookReturnedHandler(IBookLoanRepository bookLoanRepository)
        {
            _bookLoanRepository = bookLoanRepository;
        }

        public async Task<bool> Handle(IsBookReturnedQuery request, CancellationToken cancellationToken)
        {
            return await _bookLoanRepository.IsBookReturnedAsync(request.BookLoanId);
        }
    }
}


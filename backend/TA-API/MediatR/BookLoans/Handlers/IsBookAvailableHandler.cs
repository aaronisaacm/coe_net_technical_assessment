using MediatR;
using TA_API.MediatR.BookLoans.Queries;
using TA_API.Repositories;

namespace TA_API.MediatR.BookLoans.Handlers
{
    public class IsBookAvailableHandler : IRequestHandler<IsBookAvailableQuery, bool>
    {
        private readonly IBookLoanRepository _bookLoanRepository;

        public IsBookAvailableHandler(IBookLoanRepository bookLoanRepository)
        {
            _bookLoanRepository = bookLoanRepository;
        }

        public async Task<bool> Handle(IsBookAvailableQuery request, CancellationToken cancellationToken)
        {
            return await _bookLoanRepository.IsBookAvailableAsync(request.BookId);
        }
    }
}


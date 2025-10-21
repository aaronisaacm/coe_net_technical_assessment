using MediatR;
using TA_API.MediatR.BookLoans.Commands;
using TA_API.Repositories;

namespace TA_API.MediatR.BookLoans.Handlers
{
    public class ReturnBookHandler : IRequestHandler<ReturnBookCommand, bool>
    {
        private readonly IBookLoanRepository _bookLoanRepository;

        public ReturnBookHandler(IBookLoanRepository bookLoanRepository)
        {
            _bookLoanRepository = bookLoanRepository;
        }

        public async Task<bool> Handle(ReturnBookCommand request, CancellationToken cancellationToken)
        {
            return await _bookLoanRepository.ReturnBookAsync(request.BookLoanId, request.ReturnDate);
        }
    }
}


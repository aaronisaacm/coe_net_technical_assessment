using MediatR;
using TA_API.MediatR.BookLoans.Commands;
using TA_API.Repositories;

namespace TA_API.MediatR.BookLoans.Handlers
{
    public class DeleteBookLoanHandler : IRequestHandler<DeleteBookLoanCommand, bool>
    {
        private readonly IBookLoanRepository _bookLoanRepository;

        public DeleteBookLoanHandler(IBookLoanRepository bookLoanRepository)
        {
            _bookLoanRepository = bookLoanRepository;
        }

        public async Task<bool> Handle(DeleteBookLoanCommand request, CancellationToken cancellationToken)
        {
            return await _bookLoanRepository.DeleteAsync(request.BookLoanId);
        }
    }
}


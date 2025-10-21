using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.BookLoans.Commands;
using TA_API.Models;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.BookLoans.Handlers
{
    public class CreateBookLoanHandler : IRequestHandler<CreateBookLoanCommand, BookLoanDto>
    {
        private readonly IBookLoanRepository _bookLoanRepository;

        public CreateBookLoanHandler(IBookLoanRepository bookLoanRepository)
        {
            _bookLoanRepository = bookLoanRepository;
        }

        public async Task<BookLoanDto> Handle(CreateBookLoanCommand request, CancellationToken cancellationToken)
        {
            var bookLoan = new BookLoan
            {
                PersonId = request.PersonId,
                BookId = request.BookId,
                LoanDate = request.LoanDate,
                DueDate = request.DueDate,
                IsReturned = false
            };

            var createdLoan = await _bookLoanRepository.AddAsync(bookLoan);
            return createdLoan.ToDto();
        }
    }
}

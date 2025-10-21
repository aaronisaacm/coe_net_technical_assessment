using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.BookLoans.Commands;
using TA_API.Models;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.BookLoans.Handlers
{
    public class UpdateBookLoanHandler : IRequestHandler<UpdateBookLoanCommand, BookLoanDto>
    {
        private readonly IBookLoanRepository _bookLoanRepository;

        public UpdateBookLoanHandler(IBookLoanRepository bookLoanRepository)
        {
            _bookLoanRepository = bookLoanRepository;
        }

        public async Task<BookLoanDto> Handle(UpdateBookLoanCommand request, CancellationToken cancellationToken)
        {
            var bookLoan = new BookLoan
            {
                BookLoanId = request.BookLoanId,
                PersonId = request.PersonId,
                BookId = request.BookId,
                LoanDate = request.LoanDate,
                ReturnDate = request.ReturnDate,
                DueDate = request.DueDate,
                IsReturned = request.IsReturned
            };

            var updatedLoan = await _bookLoanRepository.UpdateAsync(bookLoan);
            return updatedLoan.ToDto();
        }
    }
}

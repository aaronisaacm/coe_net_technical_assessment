using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.Books.Commands;
using TA_API.Models;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.Books.Handlers
{
    public class UpdateBookHandler : IRequestHandler<UpdateBookCommand, BookDto>
    {
        private readonly IBookRepository _bookRepository;

        public UpdateBookHandler(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task<BookDto> Handle(UpdateBookCommand request, CancellationToken cancellationToken)
        {
            var book = new Book
            {
                BookId = request.BookId,
                BookName = request.BookName,
                Description = request.Description,
                Author = request.Author
            };

            var updatedBook = await _bookRepository.UpdateAsync(book);
            return updatedBook.ToDto();
        }
    }
}


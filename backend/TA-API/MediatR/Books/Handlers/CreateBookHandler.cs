using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.Books.Commands;
using TA_API.Models;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.Books.Handlers
{
    public class CreateBookHandler : IRequestHandler<CreateBookCommand, BookDto>
    {
        private readonly IBookRepository _bookRepository;

        public CreateBookHandler(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task<BookDto> Handle(CreateBookCommand request, CancellationToken cancellationToken)
        {
            var book = new Book
            {
                BookName = request.BookName,
                Description = request.Description,
                Author = request.Author
            };

            var createdBook = await _bookRepository.AddAsync(book);
            return createdBook.ToDto();
        }
    }
}


using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.Books.Queries;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.Books.Handlers
{
    public class GetBookByNameHandler : IRequestHandler<GetBookByNameQuery, BookDto?>
    {
        private readonly IBookRepository _bookRepository;

        public GetBookByNameHandler(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task<BookDto?> Handle(GetBookByNameQuery request, CancellationToken cancellationToken)
        {
            var book = await _bookRepository.GetBookByNameAsync(request.BookName);
            return book?.ToDto();
        }
    }
}


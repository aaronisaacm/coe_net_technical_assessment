using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.Books.Queries;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.Books.Handlers
{
    public class GetBookByIdHandler : IRequestHandler<GetBookByIdQuery, BookDto?>
    {
        private readonly IBookRepository _bookRepository;

        public GetBookByIdHandler(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task<BookDto?> Handle(GetBookByIdQuery request, CancellationToken cancellationToken)
        {
            var book = await _bookRepository.GetByIdAsync(request.BookId);
            return book?.ToDto();
        }
    }
}


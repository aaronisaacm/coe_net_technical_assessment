using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.Books.Queries;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.Books.Handlers
{
    public class GetAllBooksHandler : IRequestHandler<GetAllBooksQuery, IEnumerable<BookDto>>
    {
        private readonly IBookRepository _bookRepository;

        public GetAllBooksHandler(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task<IEnumerable<BookDto>> Handle(GetAllBooksQuery request, CancellationToken cancellationToken)
        {
            var books = await _bookRepository.GetAllAsync();
            return books.ToDto();
        }
    }
}


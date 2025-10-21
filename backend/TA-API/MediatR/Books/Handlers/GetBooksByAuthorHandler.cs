using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.Books.Queries;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.Books.Handlers
{
    public class GetBooksByAuthorHandler : IRequestHandler<GetBooksByAuthorQuery, IEnumerable<BookDto>>
    {
        private readonly IBookRepository _bookRepository;

        public GetBooksByAuthorHandler(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task<IEnumerable<BookDto>> Handle(GetBooksByAuthorQuery request, CancellationToken cancellationToken)
        {
            var books = await _bookRepository.GetBooksByAuthorAsync(request.Author);
            return books.ToDto();
        }
    }
}


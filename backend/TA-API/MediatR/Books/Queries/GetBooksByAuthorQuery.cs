using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.Books.Queries
{
    public class GetBooksByAuthorQuery : IRequest<IEnumerable<BookDto>>
    {
        public string Author { get; set; } = string.Empty;
    }
}


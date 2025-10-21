using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.Books.Queries
{
    public class GetBookByNameQuery : IRequest<BookDto?>
    {
        public string BookName { get; set; } = string.Empty;
    }
}


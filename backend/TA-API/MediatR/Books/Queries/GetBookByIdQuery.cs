using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.Books.Queries
{
    public class GetBookByIdQuery : IRequest<BookDto?>
    {
        public int BookId { get; set; }
    }
}


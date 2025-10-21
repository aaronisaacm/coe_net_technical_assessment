using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.Books.Queries
{
    public class GetAllBooksQuery : IRequest<IEnumerable<BookDto>>
    {
    }
}


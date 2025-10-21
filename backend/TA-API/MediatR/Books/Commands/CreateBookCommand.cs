using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.Books.Commands
{
    public class CreateBookCommand : IRequest<BookDto>
    {
        public string BookName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
    }
}


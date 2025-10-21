using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.Books.Commands
{
    public class UpdateBookCommand : IRequest<BookDto>
    {
        public int BookId { get; set; }
        public string BookName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
    }
}


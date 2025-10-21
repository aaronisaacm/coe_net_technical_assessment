using MediatR;

namespace TA_API.MediatR.Books.Commands
{
    public class DeleteBookCommand : IRequest<bool>
    {
        public int BookId { get; set; }
    }
}


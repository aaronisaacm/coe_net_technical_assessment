using MediatR;
using TA_API.MediatR.Books.Commands;
using TA_API.Repositories;

namespace TA_API.MediatR.Books.Handlers
{
    public class DeleteBookHandler : IRequestHandler<DeleteBookCommand, bool>
    {
        private readonly IBookRepository _bookRepository;

        public DeleteBookHandler(IBookRepository bookRepository)
        {
            _bookRepository = bookRepository;
        }

        public async Task<bool> Handle(DeleteBookCommand request, CancellationToken cancellationToken)
        {
            return await _bookRepository.DeleteAsync(request.BookId);
        }
    }
}


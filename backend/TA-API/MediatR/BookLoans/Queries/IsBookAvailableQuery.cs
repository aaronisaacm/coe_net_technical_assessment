using MediatR;

namespace TA_API.MediatR.BookLoans.Queries
{
    public class IsBookAvailableQuery : IRequest<bool>
    {
        public int BookId { get; set; }
    }
}


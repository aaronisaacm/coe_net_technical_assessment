using MediatR;

namespace TA_API.MediatR.Persons.Commands
{
    public class DeletePersonCommand : IRequest<bool>
    {
        public int PersonId { get; set; }
    }
}


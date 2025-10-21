using MediatR;
using TA_API.MediatR.Persons.Commands;
using TA_API.Repositories;

namespace TA_API.MediatR.Persons.Handlers
{
    public class DeletePersonHandler : IRequestHandler<DeletePersonCommand, bool>
    {
        private readonly IPersonRepository _personRepository;

        public DeletePersonHandler(IPersonRepository personRepository)
        {
            _personRepository = personRepository;
        }

        public async Task<bool> Handle(DeletePersonCommand request, CancellationToken cancellationToken)
        {
            return await _personRepository.DeleteAsync(request.PersonId);
        }
    }
}


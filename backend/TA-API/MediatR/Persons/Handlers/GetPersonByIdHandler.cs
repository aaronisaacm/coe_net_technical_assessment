using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.Persons.Queries;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.Persons.Handlers
{
    public class GetPersonByIdHandler : IRequestHandler<GetPersonByIdQuery, PersonDto?>
    {
        private readonly IPersonRepository _personRepository;

        public GetPersonByIdHandler(IPersonRepository personRepository)
        {
            _personRepository = personRepository;
        }

        public async Task<PersonDto?> Handle(GetPersonByIdQuery request, CancellationToken cancellationToken)
        {
            var person = await _personRepository.GetByIdAsync(request.PersonId);
            return person?.ToDto();
        }
    }
}


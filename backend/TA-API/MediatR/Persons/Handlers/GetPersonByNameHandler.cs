using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.Persons.Queries;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.Persons.Handlers
{
    public class GetPersonByNameHandler : IRequestHandler<GetPersonByNameQuery, PersonDto?>
    {
        private readonly IPersonRepository _personRepository;

        public GetPersonByNameHandler(IPersonRepository personRepository)
        {
            _personRepository = personRepository;
        }

        public async Task<PersonDto?> Handle(GetPersonByNameQuery request, CancellationToken cancellationToken)
        {
            var person = await _personRepository.GetPersonByNameAsync(request.Name, request.LastName);
            return person?.ToDto();
        }
    }
}


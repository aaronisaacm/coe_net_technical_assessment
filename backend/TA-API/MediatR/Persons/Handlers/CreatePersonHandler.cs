using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.Persons.Commands;
using TA_API.Models;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.Persons.Handlers
{
    public class CreatePersonHandler : IRequestHandler<CreatePersonCommand, PersonDto>
    {
        private readonly IPersonRepository _personRepository;

        public CreatePersonHandler(IPersonRepository personRepository)
        {
            _personRepository = personRepository;
        }

        public async Task<PersonDto> Handle(CreatePersonCommand request, CancellationToken cancellationToken)
        {
            var person = new Person
            {
                Name = request.Name,
                LastName = request.LastName
            };

            var createdPerson = await _personRepository.AddAsync(person);
            return createdPerson.ToDto();
        }
    }
}


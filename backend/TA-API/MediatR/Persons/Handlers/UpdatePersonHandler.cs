using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.Persons.Commands;
using TA_API.Models;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.Persons.Handlers
{
    public class UpdatePersonHandler : IRequestHandler<UpdatePersonCommand, PersonDto>
    {
        private readonly IPersonRepository _personRepository;

        public UpdatePersonHandler(IPersonRepository personRepository)
        {
            _personRepository = personRepository;
        }

        public async Task<PersonDto> Handle(UpdatePersonCommand request, CancellationToken cancellationToken)
        {
            var person = new Person
            {
                PersonId = request.PersonId,
                Name = request.Name,
                LastName = request.LastName
            };

            var updatedPerson = await _personRepository.UpdateAsync(person);
            return updatedPerson.ToDto();
        }
    }
}


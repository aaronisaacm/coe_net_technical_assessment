using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.Persons.Commands
{
    public class UpdatePersonCommand : IRequest<PersonDto>
    {
        public int PersonId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }
}


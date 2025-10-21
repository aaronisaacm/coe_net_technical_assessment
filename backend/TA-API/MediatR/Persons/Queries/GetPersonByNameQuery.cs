using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.Persons.Queries
{
    public class GetPersonByNameQuery : IRequest<PersonDto?>
    {
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }
}


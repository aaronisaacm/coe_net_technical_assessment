using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.Persons.Queries
{
    public class GetPersonByIdQuery : IRequest<PersonDto?>
    {
        public int PersonId { get; set; }
    }
}


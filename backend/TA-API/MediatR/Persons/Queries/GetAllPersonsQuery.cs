using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.Persons.Queries
{
    public class GetAllPersonsQuery : IRequest<IEnumerable<PersonDto>>
    {
    }
}


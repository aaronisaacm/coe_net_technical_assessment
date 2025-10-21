using MediatR;
using TA_API.DTOs;

namespace TA_API.MediatR.Persons.Queries
{
    public class SearchPersonsQuery : IRequest<IEnumerable<PersonDto>>
    {
        public string SearchTerm { get; set; } = string.Empty;
    }
}


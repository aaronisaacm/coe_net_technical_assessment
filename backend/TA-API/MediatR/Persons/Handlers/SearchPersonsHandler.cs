using MediatR;
using TA_API.DTOs;
using TA_API.MediatR.Persons.Queries;
using TA_API.Repositories;
using TA_API.Mappings;

namespace TA_API.MediatR.Persons.Handlers
{
    public class SearchPersonsHandler : IRequestHandler<SearchPersonsQuery, IEnumerable<PersonDto>>
    {
        private readonly IPersonRepository _personRepository;

        public SearchPersonsHandler(IPersonRepository personRepository)
        {
            _personRepository = personRepository;
        }

        public async Task<IEnumerable<PersonDto>> Handle(SearchPersonsQuery request, CancellationToken cancellationToken)
        {
            var persons = await _personRepository.SearchByNameAsync(request.SearchTerm);
            return persons.ToDto();
        }
    }
}


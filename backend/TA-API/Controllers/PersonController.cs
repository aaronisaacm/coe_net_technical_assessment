using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TA_API.MediatR.Persons.Commands;
using TA_API.MediatR.Persons.Queries;
using TA_API.DTOs;

namespace TA_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PersonController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<PersonController> _logger;

        public PersonController(IMediator mediator, ILogger<PersonController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/Person
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonDto>>> GetAllPersons()
        {
            try
            {
                var persons = await _mediator.Send(new GetAllPersonsQuery());
                return Ok(persons);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all persons");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Person/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PersonDto>> GetPerson(int id)
        {
            try
            {
                var person = await _mediator.Send(new GetPersonByIdQuery { PersonId = id });
                
                if (person == null)
                {
                    return NotFound($"Person with ID {id} not found");
                }
                
                return Ok(person);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving person with ID {PersonId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Person/search/John
        [HttpGet("search/{searchTerm}")]
        public async Task<ActionResult<IEnumerable<PersonDto>>> SearchPersons(string searchTerm)
        {
            try
            {
                var persons = await _mediator.Send(new SearchPersonsQuery { SearchTerm = searchTerm });
                return Ok(persons);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching persons with term {SearchTerm}", searchTerm);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Person/byname?name=John&lastName=Smith
        [HttpGet("byname")]
        public async Task<ActionResult<PersonDto>> GetPersonByName([FromQuery] string name, [FromQuery] string lastName)
        {
            try
            {
                var person = await _mediator.Send(new GetPersonByNameQuery { Name = name, LastName = lastName });
                
                if (person == null)
                {
                    return NotFound($"Person with name '{name} {lastName}' not found");
                }
                
                return Ok(person);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving person by name {Name} {LastName}", name, lastName);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/Person
        [HttpPost]
        public async Task<ActionResult<PersonDto>> CreatePerson([FromBody] CreatePersonCommand command)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdPerson = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetPerson), new { id = createdPerson.PersonId }, createdPerson);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating person");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/Person/5
        [HttpPut("{id}")]
        public async Task<ActionResult<PersonDto>> UpdatePerson(int id, [FromBody] UpdatePersonCommand command)
        {
            try
            {
                if (id != command.PersonId)
                {
                    return BadRequest("ID mismatch");
                }

                var updatedPerson = await _mediator.Send(command);
                return Ok(updatedPerson);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating person with ID {PersonId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/Person/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePerson(int id)
        {
            try
            {
                var result = await _mediator.Send(new DeletePersonCommand { PersonId = id });
                
                if (!result)
                {
                    return NotFound($"Person with ID {id} not found");
                }
                
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting person with ID {PersonId}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}

using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TA_API.MediatR.Books.Commands;
using TA_API.MediatR.Books.Queries;
using TA_API.DTOs;

namespace TA_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BookController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<BookController> _logger;

        public BookController(IMediator mediator, ILogger<BookController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/Book
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetAllBooks()
        {
            try
            {
                var books = await _mediator.Send(new GetAllBooksQuery());
                return Ok(books);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all books");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Book/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDto>> GetBook(int id)
        {
            try
            {
                var book = await _mediator.Send(new GetBookByIdQuery { BookId = id });
                
                if (book == null)
                {
                    return NotFound($"Book with ID {id} not found");
                }
                
                return Ok(book);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving book with ID {BookId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Book/author/Martin
        [HttpGet("author/{author}")]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetBooksByAuthor(string author)
        {
            try
            {
                var books = await _mediator.Send(new GetBooksByAuthorQuery { Author = author });
                return Ok(books);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving books by author {Author}", author);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Book/name/Clean Code
        [HttpGet("name/{bookName}")]
        public async Task<ActionResult<BookDto>> GetBookByName(string bookName)
        {
            try
            {
                var book = await _mediator.Send(new GetBookByNameQuery { BookName = bookName });
                
                if (book == null)
                {
                    return NotFound($"Book with name '{bookName}' not found");
                }
                
                return Ok(book);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving book with name {BookName}", bookName);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/Book
        [HttpPost]
        public async Task<ActionResult<BookDto>> CreateBook([FromBody] CreateBookCommand command)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var createdBook = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetBook), new { id = createdBook.BookId }, createdBook);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating book");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/Book/5
        [HttpPut("{id}")]
        public async Task<ActionResult<BookDto>> UpdateBook(int id, [FromBody] UpdateBookCommand command)
        {
            try
            {
                if (id != command.BookId)
                {
                    return BadRequest("ID mismatch");
                }

                var updatedBook = await _mediator.Send(command);
                return Ok(updatedBook);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating book with ID {BookId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/Book/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBook(int id)
        {
            try
            {
                var result = await _mediator.Send(new DeleteBookCommand { BookId = id });
                
                if (!result)
                {
                    return NotFound($"Book with ID {id} not found");
                }
                
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting book with ID {BookId}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}

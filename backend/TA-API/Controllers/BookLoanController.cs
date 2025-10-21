using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TA_API.MediatR.BookLoans.Commands;
using TA_API.MediatR.BookLoans.Queries;
using TA_API.DTOs;

namespace TA_API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BookLoanController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<BookLoanController> _logger;

        public BookLoanController(IMediator mediator, ILogger<BookLoanController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        // GET: api/BookLoan
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookLoanDto>>> GetAllBookLoans()
        {
            try
            {
                var bookLoans = await _mediator.Send(new GetAllBookLoansQuery());
                return Ok(bookLoans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all book loans");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/BookLoan/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookLoanDto>> GetBookLoan(int id)
        {
            try
            {
                var bookLoan = await _mediator.Send(new GetBookLoanByIdQuery { BookLoanId = id });
                
                if (bookLoan == null)
                {
                    return NotFound($"Book loan with ID {id} not found");
                }
                
                return Ok(bookLoan);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving book loan with ID {LoanId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/BookLoan/person/5/active
        [HttpGet("person/{personId}/active")]
        public async Task<ActionResult<IEnumerable<BookLoanDto>>> GetActiveLoansbyPerson(int personId)
        {
            try
            {
                var loans = await _mediator.Send(new GetActiveLoansByPersonQuery { PersonId = personId });
                return Ok(loans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving active loans for person {PersonId}", personId);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/BookLoan/person/5/history
        [HttpGet("person/{personId}/history")]
        public async Task<ActionResult<IEnumerable<BookLoanDto>>> GetLoanHistoryByPerson(int personId)
        {
            try
            {
                var loans = await _mediator.Send(new GetLoanHistoryByPersonQuery { PersonId = personId });
                return Ok(loans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving loan history for person {PersonId}", personId);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/BookLoan/book/5/active
        [HttpGet("book/{bookId}/active")]
        public async Task<ActionResult<IEnumerable<BookLoanDto>>> GetActiveLoansByBook(int bookId)
        {
            try
            {
                var loans = await _mediator.Send(new GetActiveLoansByBookQuery { BookId = bookId });
                return Ok(loans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving active loans for book {BookId}", bookId);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/BookLoan/book/5/available
        [HttpGet("book/{bookId}/available")]
        public async Task<ActionResult<bool>> IsBookAvailable(int bookId)
        {
            try
            {
                var isAvailable = await _mediator.Send(new IsBookAvailableQuery { BookId = bookId });
                return Ok(new { bookId, isAvailable });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking availability for book {BookId}", bookId);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/BookLoan/overdue
        [HttpGet("overdue")]
        public async Task<ActionResult<IEnumerable<BookLoanDto>>> GetOverdueLoans()
        {
            try
            {
                var loans = await _mediator.Send(new GetOverdueLoansQuery());
                return Ok(loans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving overdue loans");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/BookLoan/returned
        [HttpGet("returned")]
        public async Task<ActionResult<IEnumerable<BookLoanDto>>> GetReturnedLoans()
        {
            try
            {
                var loans = await _mediator.Send(new GetReturnedLoansQuery());
                return Ok(loans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving returned loans");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/BookLoan/5/returned
        [HttpGet("{id}/returned")]
        public async Task<ActionResult<bool>> IsBookReturned(int id)
        {
            try
            {
                var isReturned = await _mediator.Send(new IsBookReturnedQuery { BookLoanId = id });
                return Ok(new { loanId = id, isReturned });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking return status for loan {LoanId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/BookLoan
        [HttpPost]
        public async Task<ActionResult<BookLoanDto>> CreateBookLoan([FromBody] CreateBookLoanCommand command)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if book is available
                var isAvailable = await _mediator.Send(new IsBookAvailableQuery { BookId = command.BookId });
                if (!isAvailable)
                {
                    return BadRequest("Book is currently on loan and not available");
                }

                var createdLoan = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetBookLoan), new { id = createdLoan.BookLoanId }, createdLoan);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating book loan");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/BookLoan/5
        [HttpPut("{id}")]
        public async Task<ActionResult<BookLoanDto>> UpdateBookLoan(int id, [FromBody] UpdateBookLoanCommand command)
        {
            try
            {
                if (id != command.BookLoanId)
                {
                    return BadRequest("ID mismatch");
                }

                var updatedLoan = await _mediator.Send(command);
                return Ok(updatedLoan);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating book loan with ID {LoanId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/BookLoan/5/return
        [HttpPut("{id}/return")]
        public async Task<ActionResult> ReturnBook(int id, [FromBody] DateTime? returnDate = null)
        {
            try
            {
                var actualReturnDate = returnDate ?? DateTime.Now;
                var result = await _mediator.Send(new ReturnBookCommand 
                { 
                    BookLoanId = id, 
                    ReturnDate = actualReturnDate 
                });
                
                if (!result)
                {
                    return BadRequest($"Unable to return book. Loan {id} not found or already returned");
                }
                
                return Ok(new { message = "Book returned successfully", loanId = id, returnDate = actualReturnDate });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error returning book for loan {LoanId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/BookLoan/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBookLoan(int id)
        {
            try
            {
                var result = await _mediator.Send(new DeleteBookLoanCommand { BookLoanId = id });
                
                if (!result)
                {
                    return NotFound($"Book loan with ID {id} not found");
                }
                
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting book loan with ID {LoanId}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}

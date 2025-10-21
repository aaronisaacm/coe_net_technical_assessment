using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using MediatR;
using TA_API.Controllers;
using TA_API.DTOs;
using TA_API.MediatR.BookLoans.Commands;
using TA_API.MediatR.BookLoans.Queries;

namespace TA_API_Test.Controllers
{
    [TestClass]
    public class BookLoanControllerTests
    {
        private Mock<IMediator> _mediatorMock = null!;
        private Mock<ILogger<BookLoanController>> _loggerMock = null!;
        private BookLoanController _controller = null!;

        [TestInitialize]
        public void Setup()
        {
            _mediatorMock = new Mock<IMediator>();
            _loggerMock = new Mock<ILogger<BookLoanController>>();
            _controller = new BookLoanController(_mediatorMock.Object, _loggerMock.Object);
        }

        [TestMethod]
        public async Task GetAllBookLoans_ReturnsOkWithLoans()
        {
            // Arrange
            var loans = new List<BookLoanDto>
            {
                new BookLoanDto 
                { 
                    BookLoanId = 1, 
                    PersonId = 1, 
                    BookId = 1, 
                    LoanDate = DateTime.Now.AddDays(-10),
                    DueDate = DateTime.Now.AddDays(18),
                    IsReturned = false 
                }
            };

            _mediatorMock
                .Setup(m => m.Send(It.IsAny<GetAllBookLoansQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(loans);

            // Act
            var result = await _controller.GetAllBookLoans();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedLoans = okResult.Value as IEnumerable<BookLoanDto>;
            Assert.IsNotNull(returnedLoans);
            Assert.AreEqual(1, returnedLoans.Count());
        }

        [TestMethod]
        public async Task GetBookLoan_WithValidId_ReturnsOkWithLoan()
        {
            // Arrange
            var loanId = 1;
            var loan = new BookLoanDto 
            { 
                BookLoanId = loanId, 
                PersonId = 1, 
                BookId = 1,
                LoanDate = DateTime.Now.AddDays(-10),
                DueDate = DateTime.Now.AddDays(18),
                IsReturned = false,
                Person = new PersonDto { PersonId = 1, Name = "Aaron", LastName = "Isaac" },
                Book = new BookDto { BookId = 1, BookName = "Clean Code", Author = "Robert C. Martin", Description = "A handbook" }
            };

            _mediatorMock
                .Setup(m => m.Send(It.Is<GetBookLoanByIdQuery>(q => q.BookLoanId == loanId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(loan);

            // Act
            var result = await _controller.GetBookLoan(loanId);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedLoan = okResult.Value as BookLoanDto;
            Assert.IsNotNull(returnedLoan);
            Assert.AreEqual(loanId, returnedLoan.BookLoanId);
            Assert.IsNotNull(returnedLoan.Person);
            Assert.IsNotNull(returnedLoan.Book);
        }

        [TestMethod]
        public async Task GetBookLoan_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var loanId = 999;

            _mediatorMock
                .Setup(m => m.Send(It.Is<GetBookLoanByIdQuery>(q => q.BookLoanId == loanId), It.IsAny<CancellationToken>()))
                .ReturnsAsync((BookLoanDto?)null);

            // Act
            var result = await _controller.GetBookLoan(loanId);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            Assert.IsNotNull(notFoundResult);
            Assert.AreEqual(404, notFoundResult.StatusCode);
        }

        [TestMethod]
        public async Task GetActiveLoansByPerson_ReturnsOkWithLoans()
        {
            // Arrange
            var personId = 1;
            var loans = new List<BookLoanDto>
            {
                new BookLoanDto 
                { 
                    BookLoanId = 1, 
                    PersonId = personId, 
                    BookId = 1,
                    LoanDate = DateTime.Now.AddDays(-10),
                    DueDate = DateTime.Now.AddDays(18),
                    IsReturned = false 
                }
            };

            _mediatorMock
                .Setup(m => m.Send(It.Is<GetActiveLoansByPersonQuery>(q => q.PersonId == personId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(loans);

            // Act
            var result = await _controller.GetActiveLoansbyPerson(personId);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedLoans = okResult.Value as IEnumerable<BookLoanDto>;
            Assert.IsNotNull(returnedLoans);
            Assert.AreEqual(1, returnedLoans.Count());
        }

        [TestMethod]
        public async Task GetLoanHistoryByPerson_ReturnsOkWithLoans()
        {
            // Arrange
            var personId = 1;
            var loans = new List<BookLoanDto>
            {
                new BookLoanDto 
                { 
                    BookLoanId = 1, 
                    PersonId = personId, 
                    BookId = 1,
                    LoanDate = DateTime.Now.AddDays(-10),
                    DueDate = DateTime.Now.AddDays(18),
                    IsReturned = false 
                },
                new BookLoanDto 
                { 
                    BookLoanId = 2, 
                    PersonId = personId, 
                    BookId = 2,
                    LoanDate = DateTime.Now.AddDays(-40),
                    DueDate = DateTime.Now.AddDays(-12),
                    ReturnDate = DateTime.Now.AddDays(-15),
                    IsReturned = true 
                }
            };

            _mediatorMock
                .Setup(m => m.Send(It.Is<GetLoanHistoryByPersonQuery>(q => q.PersonId == personId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(loans);

            // Act
            var result = await _controller.GetLoanHistoryByPerson(personId);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedLoans = okResult.Value as IEnumerable<BookLoanDto>;
            Assert.IsNotNull(returnedLoans);
            Assert.AreEqual(2, returnedLoans.Count());
        }

        [TestMethod]
        public async Task GetActiveLoansByBook_ReturnsOkWithLoans()
        {
            // Arrange
            var bookId = 1;
            var loans = new List<BookLoanDto>
            {
                new BookLoanDto 
                { 
                    BookLoanId = 1, 
                    PersonId = 1, 
                    BookId = bookId,
                    LoanDate = DateTime.Now.AddDays(-10),
                    DueDate = DateTime.Now.AddDays(18),
                    IsReturned = false 
                }
            };

            _mediatorMock
                .Setup(m => m.Send(It.Is<GetActiveLoansByBookQuery>(q => q.BookId == bookId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(loans);

            // Act
            var result = await _controller.GetActiveLoansByBook(bookId);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
        }

        [TestMethod]
        public async Task IsBookAvailable_ReturnsOkWithAvailability()
        {
            // Arrange
            var bookId = 1;

            _mediatorMock
                .Setup(m => m.Send(It.Is<IsBookAvailableQuery>(q => q.BookId == bookId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.IsBookAvailable(bookId);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
        }

        [TestMethod]
        public async Task GetOverdueLoans_ReturnsOkWithLoans()
        {
            // Arrange
            var loans = new List<BookLoanDto>
            {
                new BookLoanDto 
                { 
                    BookLoanId = 1, 
                    PersonId = 1, 
                    BookId = 1,
                    LoanDate = DateTime.Now.AddDays(-40),
                    DueDate = DateTime.Now.AddDays(-5),
                    IsReturned = false 
                }
            };

            _mediatorMock
                .Setup(m => m.Send(It.IsAny<GetOverdueLoansQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(loans);

            // Act
            var result = await _controller.GetOverdueLoans();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedLoans = okResult.Value as IEnumerable<BookLoanDto>;
            Assert.IsNotNull(returnedLoans);
            Assert.AreEqual(1, returnedLoans.Count());
        }

        [TestMethod]
        public async Task GetReturnedLoans_ReturnsOkWithLoans()
        {
            // Arrange
            var loans = new List<BookLoanDto>
            {
                new BookLoanDto 
                { 
                    BookLoanId = 1, 
                    PersonId = 1, 
                    BookId = 1,
                    LoanDate = DateTime.Now.AddDays(-40),
                    DueDate = DateTime.Now.AddDays(-12),
                    ReturnDate = DateTime.Now.AddDays(-15),
                    IsReturned = true 
                }
            };

            _mediatorMock
                .Setup(m => m.Send(It.IsAny<GetReturnedLoansQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(loans);

            // Act
            var result = await _controller.GetReturnedLoans();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
        }

        [TestMethod]
        public async Task IsBookReturned_ReturnsOkWithStatus()
        {
            // Arrange
            var loanId = 1;

            _mediatorMock
                .Setup(m => m.Send(It.Is<IsBookReturnedQuery>(q => q.BookLoanId == loanId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.IsBookReturned(loanId);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
        }

        [TestMethod]
        public async Task CreateBookLoan_WithAvailableBook_ReturnsCreatedAtAction()
        {
            // Arrange
            var command = new CreateBookLoanCommand 
            { 
                PersonId = 1, 
                BookId = 1, 
                LoanDate = DateTime.Now,
                DueDate = DateTime.Now.AddDays(28)
            };
            
            var createdLoan = new BookLoanDto 
            { 
                BookLoanId = 10, 
                PersonId = command.PersonId, 
                BookId = command.BookId,
                LoanDate = command.LoanDate,
                DueDate = command.DueDate,
                IsReturned = false
            };

            _mediatorMock
                .Setup(m => m.Send(It.Is<IsBookAvailableQuery>(q => q.BookId == command.BookId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

            _mediatorMock
                .Setup(m => m.Send(command, It.IsAny<CancellationToken>()))
                .ReturnsAsync(createdLoan);

            // Act
            var result = await _controller.CreateBookLoan(command);

            // Assert
            var createdResult = result.Result as CreatedAtActionResult;
            Assert.IsNotNull(createdResult);
            Assert.AreEqual(201, createdResult.StatusCode);
            Assert.AreEqual(nameof(BookLoanController.GetBookLoan), createdResult.ActionName);
        }

        [TestMethod]
        public async Task CreateBookLoan_WithUnavailableBook_ReturnsBadRequest()
        {
            // Arrange
            var command = new CreateBookLoanCommand 
            { 
                PersonId = 1, 
                BookId = 1, 
                LoanDate = DateTime.Now,
                DueDate = DateTime.Now.AddDays(28)
            };

            _mediatorMock
                .Setup(m => m.Send(It.Is<IsBookAvailableQuery>(q => q.BookId == command.BookId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.CreateBookLoan(command);

            // Assert
            var badRequestResult = result.Result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult);
            Assert.AreEqual(400, badRequestResult.StatusCode);
        }

        [TestMethod]
        public async Task UpdateBookLoan_WithValidData_ReturnsOkWithUpdatedLoan()
        {
            // Arrange
            var loanId = 1;
            var command = new UpdateBookLoanCommand 
            { 
                BookLoanId = loanId, 
                PersonId = 1, 
                BookId = 1,
                LoanDate = DateTime.Now.AddDays(-10),
                DueDate = DateTime.Now.AddDays(28),
                IsReturned = false
            };
            
            var updatedLoan = new BookLoanDto 
            { 
                BookLoanId = loanId, 
                PersonId = command.PersonId, 
                BookId = command.BookId,
                LoanDate = command.LoanDate,
                DueDate = command.DueDate,
                IsReturned = command.IsReturned
            };

            _mediatorMock
                .Setup(m => m.Send(command, It.IsAny<CancellationToken>()))
                .ReturnsAsync(updatedLoan);

            // Act
            var result = await _controller.UpdateBookLoan(loanId, command);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
        }

        [TestMethod]
        public async Task UpdateBookLoan_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            var loanId = 1;
            var command = new UpdateBookLoanCommand 
            { 
                BookLoanId = 2, // Mismatched ID
                PersonId = 1, 
                BookId = 1,
                LoanDate = DateTime.Now,
                DueDate = DateTime.Now.AddDays(28),
                IsReturned = false
            };

            // Act
            var result = await _controller.UpdateBookLoan(loanId, command);

            // Assert
            var badRequestResult = result.Result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult);
            Assert.AreEqual(400, badRequestResult.StatusCode);
        }

        [TestMethod]
        public async Task ReturnBook_WithValidLoan_ReturnsOk()
        {
            // Arrange
            var loanId = 1;

            _mediatorMock
                .Setup(m => m.Send(It.Is<ReturnBookCommand>(c => c.BookLoanId == loanId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.ReturnBook(loanId, null);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
        }

        [TestMethod]
        public async Task ReturnBook_WithInvalidLoan_ReturnsBadRequest()
        {
            // Arrange
            var loanId = 999;

            _mediatorMock
                .Setup(m => m.Send(It.Is<ReturnBookCommand>(c => c.BookLoanId == loanId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.ReturnBook(loanId, null);

            // Assert
            var badRequestResult = result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult);
            Assert.AreEqual(400, badRequestResult.StatusCode);
        }

        [TestMethod]
        public async Task DeleteBookLoan_WithValidId_ReturnsNoContent()
        {
            // Arrange
            var loanId = 1;

            _mediatorMock
                .Setup(m => m.Send(It.Is<DeleteBookLoanCommand>(c => c.BookLoanId == loanId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteBookLoan(loanId);

            // Assert
            var noContentResult = result as NoContentResult;
            Assert.IsNotNull(noContentResult);
            Assert.AreEqual(204, noContentResult.StatusCode);
        }

        [TestMethod]
        public async Task DeleteBookLoan_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var loanId = 999;

            _mediatorMock
                .Setup(m => m.Send(It.Is<DeleteBookLoanCommand>(c => c.BookLoanId == loanId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteBookLoan(loanId);

            // Assert
            var notFoundResult = result as NotFoundObjectResult;
            Assert.IsNotNull(notFoundResult);
            Assert.AreEqual(404, notFoundResult.StatusCode);
        }
    }
}


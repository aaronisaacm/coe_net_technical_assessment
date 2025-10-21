using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using MediatR;
using TA_API.Controllers;
using TA_API.DTOs;
using TA_API.MediatR.Books.Commands;
using TA_API.MediatR.Books.Queries;

namespace TA_API_Test.Controllers
{
    [TestClass]
    public class BookControllerTests
    {
        private Mock<IMediator> _mediatorMock = null!;
        private Mock<ILogger<BookController>> _loggerMock = null!;
        private BookController _controller = null!;

        [TestInitialize]
        public void Setup()
        {
            _mediatorMock = new Mock<IMediator>();
            _loggerMock = new Mock<ILogger<BookController>>();
            _controller = new BookController(_mediatorMock.Object, _loggerMock.Object);
        }

        [TestMethod]
        public async Task GetAllBooks_ReturnsOkWithBooks()
        {
            // Arrange
            var books = new List<BookDto>
            {
                new BookDto { BookId = 1, BookName = "Clean Code", Author = "Robert C. Martin", Description = "A handbook" },
                new BookDto { BookId = 2, BookName = "Design Patterns", Author = "Gang of Four", Description = "Elements" }
            };

            _mediatorMock
                .Setup(m => m.Send(It.IsAny<GetAllBooksQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(books);

            // Act
            var result = await _controller.GetAllBooks();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedBooks = okResult.Value as IEnumerable<BookDto>;
            Assert.IsNotNull(returnedBooks);
            Assert.AreEqual(2, returnedBooks.Count());
        }

        [TestMethod]
        public async Task GetBook_WithValidId_ReturnsOkWithBook()
        {
            // Arrange
            var bookId = 1;
            var book = new BookDto 
            { 
                BookId = bookId, 
                BookName = "Clean Code", 
                Author = "Robert C. Martin", 
                Description = "A handbook" 
            };

            _mediatorMock
                .Setup(m => m.Send(It.Is<GetBookByIdQuery>(q => q.BookId == bookId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(book);

            // Act
            var result = await _controller.GetBook(bookId);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedBook = okResult.Value as BookDto;
            Assert.IsNotNull(returnedBook);
            Assert.AreEqual(bookId, returnedBook.BookId);
            Assert.AreEqual("Clean Code", returnedBook.BookName);
        }

        [TestMethod]
        public async Task GetBook_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var bookId = 999;

            _mediatorMock
                .Setup(m => m.Send(It.Is<GetBookByIdQuery>(q => q.BookId == bookId), It.IsAny<CancellationToken>()))
                .ReturnsAsync((BookDto?)null);

            // Act
            var result = await _controller.GetBook(bookId);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            Assert.IsNotNull(notFoundResult);
            Assert.AreEqual(404, notFoundResult.StatusCode);
        }

        [TestMethod]
        public async Task GetBooksByAuthor_ReturnsOkWithBooks()
        {
            // Arrange
            var author = "Martin";
            var books = new List<BookDto>
            {
                new BookDto { BookId = 1, BookName = "Clean Code", Author = "Robert C. Martin", Description = "A handbook" },
                new BookDto { BookId = 4, BookName = "Refactoring", Author = "Martin Fowler", Description = "Improving code" }
            };

            _mediatorMock
                .Setup(m => m.Send(It.Is<GetBooksByAuthorQuery>(q => q.Author == author), It.IsAny<CancellationToken>()))
                .ReturnsAsync(books);

            // Act
            var result = await _controller.GetBooksByAuthor(author);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedBooks = okResult.Value as IEnumerable<BookDto>;
            Assert.IsNotNull(returnedBooks);
            Assert.AreEqual(2, returnedBooks.Count());
        }

        [TestMethod]
        public async Task GetBookByName_WithValidName_ReturnsOkWithBook()
        {
            // Arrange
            var bookName = "Clean Code";
            var book = new BookDto 
            { 
                BookId = 1, 
                BookName = bookName, 
                Author = "Robert C. Martin", 
                Description = "A handbook" 
            };

            _mediatorMock
                .Setup(m => m.Send(It.Is<GetBookByNameQuery>(q => q.BookName == bookName), It.IsAny<CancellationToken>()))
                .ReturnsAsync(book);

            // Act
            var result = await _controller.GetBookByName(bookName);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedBook = okResult.Value as BookDto;
            Assert.IsNotNull(returnedBook);
            Assert.AreEqual(bookName, returnedBook.BookName);
        }

        [TestMethod]
        public async Task GetBookByName_WithInvalidName_ReturnsNotFound()
        {
            // Arrange
            var bookName = "Nonexistent Book";

            _mediatorMock
                .Setup(m => m.Send(It.Is<GetBookByNameQuery>(q => q.BookName == bookName), It.IsAny<CancellationToken>()))
                .ReturnsAsync((BookDto?)null);

            // Act
            var result = await _controller.GetBookByName(bookName);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            Assert.IsNotNull(notFoundResult);
            Assert.AreEqual(404, notFoundResult.StatusCode);
        }

        [TestMethod]
        public async Task CreateBook_WithValidData_ReturnsCreatedAtAction()
        {
            // Arrange
            var command = new CreateBookCommand 
            { 
                BookName = "New Book", 
                Author = "New Author", 
                Description = "New Description" 
            };
            
            var createdBook = new BookDto 
            { 
                BookId = 10, 
                BookName = command.BookName, 
                Author = command.Author, 
                Description = command.Description 
            };

            _mediatorMock
                .Setup(m => m.Send(command, It.IsAny<CancellationToken>()))
                .ReturnsAsync(createdBook);

            // Act
            var result = await _controller.CreateBook(command);

            // Assert
            var createdResult = result.Result as CreatedAtActionResult;
            Assert.IsNotNull(createdResult);
            Assert.AreEqual(201, createdResult.StatusCode);
            Assert.AreEqual(nameof(BookController.GetBook), createdResult.ActionName);
            
            var returnedBook = createdResult.Value as BookDto;
            Assert.IsNotNull(returnedBook);
            Assert.AreEqual(10, returnedBook.BookId);
            Assert.AreEqual("New Book", returnedBook.BookName);
        }

        [TestMethod]
        public async Task UpdateBook_WithValidData_ReturnsOkWithUpdatedBook()
        {
            // Arrange
            var bookId = 1;
            var command = new UpdateBookCommand 
            { 
                BookId = bookId, 
                BookName = "Updated Book", 
                Author = "Updated Author", 
                Description = "Updated Description" 
            };
            
            var updatedBook = new BookDto 
            { 
                BookId = bookId, 
                BookName = command.BookName, 
                Author = command.Author, 
                Description = command.Description 
            };

            _mediatorMock
                .Setup(m => m.Send(command, It.IsAny<CancellationToken>()))
                .ReturnsAsync(updatedBook);

            // Act
            var result = await _controller.UpdateBook(bookId, command);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedBook = okResult.Value as BookDto;
            Assert.IsNotNull(returnedBook);
            Assert.AreEqual("Updated Book", returnedBook.BookName);
        }

        [TestMethod]
        public async Task UpdateBook_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            var bookId = 1;
            var command = new UpdateBookCommand 
            { 
                BookId = 2, // Mismatched ID
                BookName = "Updated Book", 
                Author = "Updated Author", 
                Description = "Updated Description" 
            };

            // Act
            var result = await _controller.UpdateBook(bookId, command);

            // Assert
            var badRequestResult = result.Result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult);
            Assert.AreEqual(400, badRequestResult.StatusCode);
        }

        [TestMethod]
        public async Task DeleteBook_WithValidId_ReturnsNoContent()
        {
            // Arrange
            var bookId = 1;

            _mediatorMock
                .Setup(m => m.Send(It.Is<DeleteBookCommand>(c => c.BookId == bookId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteBook(bookId);

            // Assert
            var noContentResult = result as NoContentResult;
            Assert.IsNotNull(noContentResult);
            Assert.AreEqual(204, noContentResult.StatusCode);
        }

        [TestMethod]
        public async Task DeleteBook_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var bookId = 999;

            _mediatorMock
                .Setup(m => m.Send(It.Is<DeleteBookCommand>(c => c.BookId == bookId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteBook(bookId);

            // Assert
            var notFoundResult = result as NotFoundObjectResult;
            Assert.IsNotNull(notFoundResult);
            Assert.AreEqual(404, notFoundResult.StatusCode);
        }
    }
}


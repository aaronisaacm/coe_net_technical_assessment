using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using MediatR;
using TA_API.Controllers;
using TA_API.DTOs;
using TA_API.MediatR.Persons.Commands;
using TA_API.MediatR.Persons.Queries;

namespace TA_API_Test.Controllers
{
    [TestClass]
    public class PersonControllerTests
    {
        private Mock<IMediator> _mediatorMock = null!;
        private Mock<ILogger<PersonController>> _loggerMock = null!;
        private PersonController _controller = null!;

        [TestInitialize]
        public void Setup()
        {
            _mediatorMock = new Mock<IMediator>();
            _loggerMock = new Mock<ILogger<PersonController>>();
            _controller = new PersonController(_mediatorMock.Object, _loggerMock.Object);
        }

        [TestMethod]
        public async Task GetAllPersons_ReturnsOkWithPersons()
        {
            // Arrange
            var persons = new List<PersonDto>
            {
                new PersonDto { PersonId = 1, Name = "Aaron", LastName = "Isaac" },
                new PersonDto { PersonId = 2, Name = "John", LastName = "Smith" }
            };

            _mediatorMock
                .Setup(m => m.Send(It.IsAny<GetAllPersonsQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(persons);

            // Act
            var result = await _controller.GetAllPersons();

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedPersons = okResult.Value as IEnumerable<PersonDto>;
            Assert.IsNotNull(returnedPersons);
            Assert.AreEqual(2, returnedPersons.Count());
        }

        [TestMethod]
        public async Task GetPerson_WithValidId_ReturnsOkWithPerson()
        {
            // Arrange
            var personId = 1;
            var person = new PersonDto 
            { 
                PersonId = personId, 
                Name = "Aaron", 
                LastName = "Isaac" 
            };

            _mediatorMock
                .Setup(m => m.Send(It.Is<GetPersonByIdQuery>(q => q.PersonId == personId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(person);

            // Act
            var result = await _controller.GetPerson(personId);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedPerson = okResult.Value as PersonDto;
            Assert.IsNotNull(returnedPerson);
            Assert.AreEqual(personId, returnedPerson.PersonId);
            Assert.AreEqual("Aaron Isaac", returnedPerson.FullName);
        }

        [TestMethod]
        public async Task GetPerson_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var personId = 999;

            _mediatorMock
                .Setup(m => m.Send(It.Is<GetPersonByIdQuery>(q => q.PersonId == personId), It.IsAny<CancellationToken>()))
                .ReturnsAsync((PersonDto?)null);

            // Act
            var result = await _controller.GetPerson(personId);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            Assert.IsNotNull(notFoundResult);
            Assert.AreEqual(404, notFoundResult.StatusCode);
        }

        [TestMethod]
        public async Task SearchPersons_ReturnsOkWithMatchingPersons()
        {
            // Arrange
            var searchTerm = "John";
            var persons = new List<PersonDto>
            {
                new PersonDto { PersonId = 2, Name = "John", LastName = "Smith" },
                new PersonDto { PersonId = 3, Name = "Emma", LastName = "Johnson" }
            };

            _mediatorMock
                .Setup(m => m.Send(It.Is<SearchPersonsQuery>(q => q.SearchTerm == searchTerm), It.IsAny<CancellationToken>()))
                .ReturnsAsync(persons);

            // Act
            var result = await _controller.SearchPersons(searchTerm);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedPersons = okResult.Value as IEnumerable<PersonDto>;
            Assert.IsNotNull(returnedPersons);
            Assert.AreEqual(2, returnedPersons.Count());
        }

        [TestMethod]
        public async Task GetPersonByName_WithValidName_ReturnsOkWithPerson()
        {
            // Arrange
            var name = "John";
            var lastName = "Smith";
            var person = new PersonDto 
            { 
                PersonId = 2, 
                Name = name, 
                LastName = lastName 
            };

            _mediatorMock
                .Setup(m => m.Send(
                    It.Is<GetPersonByNameQuery>(q => q.Name == name && q.LastName == lastName), 
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(person);

            // Act
            var result = await _controller.GetPersonByName(name, lastName);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedPerson = okResult.Value as PersonDto;
            Assert.IsNotNull(returnedPerson);
            Assert.AreEqual("John Smith", returnedPerson.FullName);
        }

        [TestMethod]
        public async Task GetPersonByName_WithInvalidName_ReturnsNotFound()
        {
            // Arrange
            var name = "Nonexistent";
            var lastName = "Person";

            _mediatorMock
                .Setup(m => m.Send(
                    It.Is<GetPersonByNameQuery>(q => q.Name == name && q.LastName == lastName), 
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync((PersonDto?)null);

            // Act
            var result = await _controller.GetPersonByName(name, lastName);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            Assert.IsNotNull(notFoundResult);
            Assert.AreEqual(404, notFoundResult.StatusCode);
        }

        [TestMethod]
        public async Task CreatePerson_WithValidData_ReturnsCreatedAtAction()
        {
            // Arrange
            var command = new CreatePersonCommand 
            { 
                Name = "Jane", 
                LastName = "Doe" 
            };
            
            var createdPerson = new PersonDto 
            { 
                PersonId = 10, 
                Name = command.Name, 
                LastName = command.LastName 
            };

            _mediatorMock
                .Setup(m => m.Send(command, It.IsAny<CancellationToken>()))
                .ReturnsAsync(createdPerson);

            // Act
            var result = await _controller.CreatePerson(command);

            // Assert
            var createdResult = result.Result as CreatedAtActionResult;
            Assert.IsNotNull(createdResult);
            Assert.AreEqual(201, createdResult.StatusCode);
            Assert.AreEqual(nameof(PersonController.GetPerson), createdResult.ActionName);
            
            var returnedPerson = createdResult.Value as PersonDto;
            Assert.IsNotNull(returnedPerson);
            Assert.AreEqual(10, returnedPerson.PersonId);
            Assert.AreEqual("Jane Doe", returnedPerson.FullName);
        }

        [TestMethod]
        public async Task UpdatePerson_WithValidData_ReturnsOkWithUpdatedPerson()
        {
            // Arrange
            var personId = 1;
            var command = new UpdatePersonCommand 
            { 
                PersonId = personId, 
                Name = "Aaron", 
                LastName = "Isaac Jr." 
            };
            
            var updatedPerson = new PersonDto 
            { 
                PersonId = personId, 
                Name = command.Name, 
                LastName = command.LastName 
            };

            _mediatorMock
                .Setup(m => m.Send(command, It.IsAny<CancellationToken>()))
                .ReturnsAsync(updatedPerson);

            // Act
            var result = await _controller.UpdatePerson(personId, command);

            // Assert
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            
            var returnedPerson = okResult.Value as PersonDto;
            Assert.IsNotNull(returnedPerson);
            Assert.AreEqual("Aaron Isaac Jr.", returnedPerson.FullName);
        }

        [TestMethod]
        public async Task UpdatePerson_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            var personId = 1;
            var command = new UpdatePersonCommand 
            { 
                PersonId = 2, // Mismatched ID
                Name = "Aaron", 
                LastName = "Isaac" 
            };

            // Act
            var result = await _controller.UpdatePerson(personId, command);

            // Assert
            var badRequestResult = result.Result as BadRequestObjectResult;
            Assert.IsNotNull(badRequestResult);
            Assert.AreEqual(400, badRequestResult.StatusCode);
        }

        [TestMethod]
        public async Task DeletePerson_WithValidId_ReturnsNoContent()
        {
            // Arrange
            var personId = 1;

            _mediatorMock
                .Setup(m => m.Send(It.Is<DeletePersonCommand>(c => c.PersonId == personId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.DeletePerson(personId);

            // Assert
            var noContentResult = result as NoContentResult;
            Assert.IsNotNull(noContentResult);
            Assert.AreEqual(204, noContentResult.StatusCode);
        }

        [TestMethod]
        public async Task DeletePerson_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var personId = 999;

            _mediatorMock
                .Setup(m => m.Send(It.Is<DeletePersonCommand>(c => c.PersonId == personId), It.IsAny<CancellationToken>()))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.DeletePerson(personId);

            // Assert
            var notFoundResult = result as NotFoundObjectResult;
            Assert.IsNotNull(notFoundResult);
            Assert.AreEqual(404, notFoundResult.StatusCode);
        }
    }
}


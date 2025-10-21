# Book Loan Management System API

A comprehensive REST API for managing a book loan system built with .NET 9, Entity Framework Core, MediatR, and Clean Architecture principles.

## 🏗️ Architecture

- **Clean Architecture** with separation of concerns
- **CQRS Pattern** using MediatR
- **Repository Pattern** for data access
- **DTO Pattern** for API responses
- **Entity Framework Core** with SQLite
- **Basic Authentication** for API security
- **Swagger/OpenAPI** documentation with auth support

## 🚀 Getting Started

### Prerequisites

- .NET 9.0 SDK
- SQLite

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd TA-API

# Restore dependencies
dotnet restore

# Create database and apply migrations
dotnet ef migrations add InitialCreate
dotnet ef database update

# Run the application
dotnet run
```

The API will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001/swagger`

## 🔐 Authentication

This API uses **Basic Authentication**. All endpoints require authentication.

### Default Credentials

```
Username: admin
Password: admin123
```

### Using Basic Authentication

**With cURL:**
```bash
curl -X GET "http://localhost:5000/api/book" \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM="

# Or with username:password
curl -X GET "http://localhost:5000/api/book" \
  -u admin:admin123
```

**With Postman:**
1. Go to the **Authorization** tab
2. Select **Basic Auth** from the Type dropdown
3. Enter `admin` as Username
4. Enter `admin123` as Password

**With Swagger UI:**
1. Click the **Authorize** button (lock icon)
2. Enter `admin` as Username
3. Enter `admin123` as Password
4. Click **Authorize**

**With JavaScript (fetch):**
```javascript
const credentials = btoa('admin:admin123');
fetch('http://localhost:5000/api/book', {
  headers: {
    'Authorization': `Basic ${credentials}`
  }
});
```

### Changing Credentials

Edit `appsettings.json`:
```json
"Authentication": {
  "Username": "your-username",
  "Password": "your-password"
}
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

---

## 📖 Book Endpoints

### 1. Get All Books
Retrieve a list of all books in the system.

**Endpoint:** `GET /api/Book`

**Parameters:** None

**Response:** `200 OK`
```json
[
  {
    "bookId": 1,
    "bookName": "Clean Code",
    "description": "A handbook of agile software craftsmanship",
    "author": "Robert C. Martin"
  },
  {
    "bookId": 2,
    "bookName": "Design Patterns",
    "description": "Elements of reusable object-oriented software",
    "author": "Gang of Four"
  }
]
```

---

### 2. Get Book by ID
Retrieve a specific book by its ID.

**Endpoint:** `GET /api/Book/{id}`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| id | integer | path | Yes | Book ID |

**Response:** `200 OK`
```json
{
  "bookId": 1,
  "bookName": "Clean Code",
  "description": "A handbook of agile software craftsmanship",
  "author": "Robert C. Martin"
}
```

**Error Response:** `404 Not Found`
```json
"Book with ID 999 not found"
```

---

### 3. Get Books by Author
Search for books by author name (partial match supported).

**Endpoint:** `GET /api/Book/author/{author}`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| author | string | path | Yes | Author name or partial name |

**Example:** `GET /api/Book/author/Martin`

**Response:** `200 OK`
```json
[
  {
    "bookId": 1,
    "bookName": "Clean Code",
    "description": "A handbook of agile software craftsmanship",
    "author": "Robert C. Martin"
  },
  {
    "bookId": 4,
    "bookName": "Refactoring",
    "description": "Improving the design of existing code",
    "author": "Martin Fowler"
  }
]
```

---

### 4. Get Book by Name
Find a book by its exact name.

**Endpoint:** `GET /api/Book/name/{bookName}`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| bookName | string | path | Yes | Exact book name |

**Example:** `GET /api/Book/name/Clean Code`

**Response:** `200 OK`
```json
{
  "bookId": 1,
  "bookName": "Clean Code",
  "description": "A handbook of agile software craftsmanship",
  "author": "Robert C. Martin"
}
```

---

### 5. Create Book
Add a new book to the system.

**Endpoint:** `POST /api/Book`

**Request Body:**
```json
{
  "bookName": "The Phoenix Project",
  "description": "A Novel about IT, DevOps, and Helping Your Business Win",
  "author": "Gene Kim"
}
```

**Response:** `201 Created`
```json
{
  "bookId": 9,
  "bookName": "The Phoenix Project",
  "description": "A Novel about IT, DevOps, and Helping Your Business Win",
  "author": "Gene Kim"
}
```

**Headers:**
```
Location: /api/Book/9
```

---

### 6. Update Book
Update an existing book's information.

**Endpoint:** `PUT /api/Book/{id}`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| id | integer | path | Yes | Book ID |

**Request Body:**
```json
{
  "bookId": 1,
  "bookName": "Clean Code - Updated",
  "description": "Updated description",
  "author": "Robert C. Martin"
}
```

**Response:** `200 OK`
```json
{
  "bookId": 1,
  "bookName": "Clean Code - Updated",
  "description": "Updated description",
  "author": "Robert C. Martin"
}
```

**Error Response:** `400 Bad Request`
```json
"ID mismatch"
```

---

### 7. Delete Book
Remove a book from the system.

**Endpoint:** `DELETE /api/Book/{id}`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| id | integer | path | Yes | Book ID |

**Response:** `204 No Content`

**Error Response:** `404 Not Found`
```json
"Book with ID 999 not found"
```

---

## 👥 Person Endpoints

### 1. Get All Persons
Retrieve a list of all persons in the system.

**Endpoint:** `GET /api/Person`

**Parameters:** None

**Response:** `200 OK`
```json
[
  {
    "personId": 1,
    "name": "Aaron",
    "lastName": "Isaac",
    "fullName": "Aaron Isaac"
  },
  {
    "personId": 2,
    "name": "John",
    "lastName": "Smith",
    "fullName": "John Smith"
  }
]
```

---

### 2. Get Person by ID
Retrieve a specific person by their ID.

**Endpoint:** `GET /api/Person/{id}`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| id | integer | path | Yes | Person ID |

**Response:** `200 OK`
```json
{
  "personId": 1,
  "name": "Aaron",
  "lastName": "Isaac",
  "fullName": "Aaron Isaac"
}
```

---

### 3. Search Persons
Search for persons by name or last name (partial match).

**Endpoint:** `GET /api/Person/search/{searchTerm}`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| searchTerm | string | path | Yes | Search term for name or last name |

**Example:** `GET /api/Person/search/John`

**Response:** `200 OK`
```json
[
  {
    "personId": 2,
    "name": "John",
    "lastName": "Smith",
    "fullName": "John Smith"
  },
  {
    "personId": 3,
    "name": "Emma",
    "lastName": "Johnson",
    "fullName": "Emma Johnson"
  }
]
```

---

### 4. Get Person by Name
Find a person by exact first and last name.

**Endpoint:** `GET /api/Person/byname`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| name | string | query | Yes | First name |
| lastName | string | query | Yes | Last name |

**Example:** `GET /api/Person/byname?name=John&lastName=Smith`

**Response:** `200 OK`
```json
{
  "personId": 2,
  "name": "John",
  "lastName": "Smith",
  "fullName": "John Smith"
}
```

---

### 5. Create Person
Register a new person in the system.

**Endpoint:** `POST /api/Person`

**Request Body:**
```json
{
  "name": "Jane",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "personId": 6,
  "name": "Jane",
  "lastName": "Doe",
  "fullName": "Jane Doe"
}
```

---

### 6. Update Person
Update an existing person's information.

**Endpoint:** `PUT /api/Person/{id}`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| id | integer | path | Yes | Person ID |

**Request Body:**
```json
{
  "personId": 1,
  "name": "Aaron",
  "lastName": "Isaac Jr."
}
```

**Response:** `200 OK`
```json
{
  "personId": 1,
  "name": "Aaron",
  "lastName": "Isaac Jr.",
  "fullName": "Aaron Isaac Jr."
}
```

---

### 7. Delete Person
Remove a person from the system.

**Endpoint:** `DELETE /api/Person/{id}`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| id | integer | path | Yes | Person ID |

**Response:** `204 No Content`

---

## 📚 Book Loan Endpoints

### 1. Get All Book Loans
Retrieve a list of all book loans in the system.

**Endpoint:** `GET /api/BookLoan`

**Parameters:** None

**Response:** `200 OK`
```json
[
  {
    "bookLoanId": 1,
    "personId": 1,
    "bookId": 1,
    "loanDate": "2025-10-01T00:00:00",
    "returnDate": null,
    "dueDate": "2025-10-29T00:00:00",
    "isReturned": false,
    "isOverdue": false,
    "person": {
      "personId": 1,
      "name": "Aaron",
      "lastName": "Isaac",
      "fullName": "Aaron Isaac"
    },
    "book": {
      "bookId": 1,
      "bookName": "Clean Code",
      "description": "A handbook of agile software craftsmanship",
      "author": "Robert C. Martin"
    }
  }
]
```

---

### 2. Get Book Loan by ID
Retrieve a specific book loan with full details.

**Endpoint:** `GET /api/BookLoan/{id}`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| id | integer | path | Yes | Book loan ID |

**Response:** `200 OK`
```json
{
  "bookLoanId": 1,
  "personId": 1,
  "bookId": 1,
  "loanDate": "2025-10-01T00:00:00",
  "returnDate": null,
  "dueDate": "2025-10-29T00:00:00",
  "isReturned": false,
  "isOverdue": false,
  "person": {
    "personId": 1,
    "name": "Aaron",
    "lastName": "Isaac",
    "fullName": "Aaron Isaac"
  },
  "book": {
    "bookId": 1,
    "bookName": "Clean Code",
    "description": "A handbook of agile software craftsmanship",
    "author": "Robert C. Martin"
  }
}
```

---

### 3. Get Active Loans by Person
Retrieve all currently active (not returned) loans for a specific person.

**Endpoint:** `GET /api/BookLoan/person/{personId}/active`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| personId | integer | path | Yes | Person ID |

**Example:** `GET /api/BookLoan/person/1/active`

**Response:** `200 OK`
```json
[
  {
    "bookLoanId": 1,
    "personId": 1,
    "bookId": 1,
    "loanDate": "2025-10-01T00:00:00",
    "returnDate": null,
    "dueDate": "2025-10-29T00:00:00",
    "isReturned": false,
    "isOverdue": false,
    "person": {
      "personId": 1,
      "name": "Aaron",
      "lastName": "Isaac",
      "fullName": "Aaron Isaac"
    },
    "book": {
      "bookId": 1,
      "bookName": "Clean Code",
      "description": "A handbook of agile software craftsmanship",
      "author": "Robert C. Martin"
    }
  }
]
```

---

### 4. Get Loan History by Person
Retrieve complete loan history for a specific person (both active and returned).

**Endpoint:** `GET /api/BookLoan/person/{personId}/history`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| personId | integer | path | Yes | Person ID |

**Example:** `GET /api/BookLoan/person/1/history`

**Response:** `200 OK`
```json
[
  {
    "bookLoanId": 1,
    "personId": 1,
    "bookId": 1,
    "loanDate": "2025-10-01T00:00:00",
    "returnDate": null,
    "dueDate": "2025-10-29T00:00:00",
    "isReturned": false,
    "isOverdue": false,
    "person": {...},
    "book": {...}
  },
  {
    "bookLoanId": 4,
    "personId": 1,
    "bookId": 2,
    "loanDate": "2025-09-01T00:00:00",
    "returnDate": "2025-09-25T00:00:00",
    "dueDate": "2025-09-29T00:00:00",
    "isReturned": true,
    "isOverdue": false,
    "person": {...},
    "book": {...}
  }
]
```

---

### 5. Get Active Loans by Book
Check who currently has a specific book on loan.

**Endpoint:** `GET /api/BookLoan/book/{bookId}/active`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| bookId | integer | path | Yes | Book ID |

**Example:** `GET /api/BookLoan/book/1/active`

**Response:** `200 OK`
```json
[
  {
    "bookLoanId": 1,
    "personId": 1,
    "bookId": 1,
    "loanDate": "2025-10-01T00:00:00",
    "returnDate": null,
    "dueDate": "2025-10-29T00:00:00",
    "isReturned": false,
    "isOverdue": false,
    "person": {...},
    "book": {...}
  }
]
```

---

### 6. Check Book Availability
Check if a specific book is available for loan.

**Endpoint:** `GET /api/BookLoan/book/{bookId}/available`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| bookId | integer | path | Yes | Book ID |

**Example:** `GET /api/BookLoan/book/1/available`

**Response:** `200 OK`
```json
{
  "bookId": 1,
  "isAvailable": false
}
```

---

### 7. Get Overdue Loans
Retrieve all loans that are past their due date and not returned.

**Endpoint:** `GET /api/BookLoan/overdue`

**Parameters:** None

**Response:** `200 OK`
```json
[
  {
    "bookLoanId": 8,
    "personId": 4,
    "bookId": 8,
    "loanDate": "2025-09-15T00:00:00",
    "returnDate": null,
    "dueDate": "2025-10-13T00:00:00",
    "isReturned": false,
    "isOverdue": true,
    "person": {...},
    "book": {...}
  }
]
```

---

### 8. Get Returned Loans
Retrieve all loans that have been returned.

**Endpoint:** `GET /api/BookLoan/returned`

**Parameters:** None

**Response:** `200 OK`
```json
[
  {
    "bookLoanId": 4,
    "personId": 1,
    "bookId": 2,
    "loanDate": "2025-09-01T00:00:00",
    "returnDate": "2025-09-25T00:00:00",
    "dueDate": "2025-09-29T00:00:00",
    "isReturned": true,
    "isOverdue": false,
    "person": {...},
    "book": {...}
  }
]
```

---

### 9. Check Loan Return Status
Check if a specific loan has been returned.

**Endpoint:** `GET /api/BookLoan/{id}/returned`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| id | integer | path | Yes | Book loan ID |

**Example:** `GET /api/BookLoan/1/returned`

**Response:** `200 OK`
```json
{
  "loanId": 1,
  "isReturned": false
}
```

---

### 10. Create Book Loan
Create a new book loan transaction.

**Endpoint:** `POST /api/BookLoan`

**Request Body:**
```json
{
  "personId": 2,
  "bookId": 4,
  "loanDate": "2025-10-21T00:00:00",
  "dueDate": "2025-11-18T00:00:00"
}
```

**Response:** `201 Created`
```json
{
  "bookLoanId": 9,
  "personId": 2,
  "bookId": 4,
  "loanDate": "2025-10-21T00:00:00",
  "returnDate": null,
  "dueDate": "2025-11-18T00:00:00",
  "isReturned": false,
  "isOverdue": false,
  "person": null,
  "book": null
}
```

**Error Response:** `400 Bad Request`
```json
"Book is currently on loan and not available"
```

---

### 11. Update Book Loan
Update an existing book loan's information.

**Endpoint:** `PUT /api/BookLoan/{id}`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| id | integer | path | Yes | Book loan ID |

**Request Body:**
```json
{
  "bookLoanId": 1,
  "personId": 1,
  "bookId": 1,
  "loanDate": "2025-10-01T00:00:00",
  "returnDate": null,
  "dueDate": "2025-11-05T00:00:00",
  "isReturned": false
}
```

**Response:** `200 OK`
```json
{
  "bookLoanId": 1,
  "personId": 1,
  "bookId": 1,
  "loanDate": "2025-10-01T00:00:00",
  "returnDate": null,
  "dueDate": "2025-11-05T00:00:00",
  "isReturned": false,
  "isOverdue": false,
  "person": null,
  "book": null
}
```

---

### 12. Return Book
Mark a book loan as returned.

**Endpoint:** `PUT /api/BookLoan/{id}/return`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| id | integer | path | Yes | Book loan ID |

**Request Body (Optional):**
```json
"2025-10-21T14:30:00"
```

**Note:** If no return date is provided in the body, the current date/time will be used.

**Response:** `200 OK`
```json
{
  "message": "Book returned successfully",
  "loanId": 1,
  "returnDate": "2025-10-21T14:30:00"
}
```

**Error Response:** `400 Bad Request`
```json
"Unable to return book. Loan 999 not found or already returned"
```

---

### 13. Delete Book Loan
Remove a book loan record from the system.

**Endpoint:** `DELETE /api/BookLoan/{id}`

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| id | integer | path | Yes | Book loan ID |

**Response:** `204 No Content`

---

## 🔒 Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "errors": {
    "BookName": ["The BookName field is required."]
  }
}
```

### 404 Not Found
```json
"Resource with ID {id} not found"
```

### 500 Internal Server Error
```json
"Internal server error"
```

---

## 📊 Database Schema

### Books Table
| Column | Type | Constraints |
|--------|------|-------------|
| BookId | INTEGER | PRIMARY KEY |
| BookName | TEXT | NOT NULL, MAX 200 |
| Description | TEXT | NOT NULL, MAX 500 |
| Author | TEXT | NOT NULL, MAX 100 |

### People Table
| Column | Type | Constraints |
|--------|------|-------------|
| PersonId | INTEGER | PRIMARY KEY |
| Name | TEXT | NOT NULL, MAX 100 |
| LastName | TEXT | NOT NULL, MAX 100 |

### BookLoans Table
| Column | Type | Constraints |
|--------|------|-------------|
| BookLoanId | INTEGER | PRIMARY KEY |
| PersonId | INTEGER | FOREIGN KEY → People |
| BookId | INTEGER | FOREIGN KEY → Books |
| LoanDate | DATETIME | NOT NULL |
| ReturnDate | DATETIME | NULL |
| DueDate | DATETIME | NOT NULL |
| IsReturned | BOOLEAN | NOT NULL |

---

## 🛠️ Technology Stack

- **.NET 9.0** - Framework
- **Entity Framework Core 9.0** - ORM
- **SQLite** - Database
- **MediatR 13.0** - CQRS implementation
- **Serilog** - Logging
- **Swashbuckle** - API documentation
- **Clean Architecture** - Project structure

---

## 📁 Project Structure

```
TA-API/
├── Controllers/          # API Controllers
├── DTOs/                 # Data Transfer Objects
├── MediatR/              # CQRS Commands, Queries & Handlers
│   ├── Books/
│   ├── Persons/
│   └── BookLoans/
├── Mappings/             # Entity to DTO mappings
├── Models/               # Domain entities
├── Repositories/         # Data access layer
└── Services/
    └── Data/             # DbContext
```

---

## 🧪 Testing with Swagger

1. Run the application
2. Navigate to `https://localhost:5001/swagger`
3. Explore and test all endpoints interactively

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Aaron Isaac**  
Technical Assessment - CoE .NET

---

## 📮 Support

For questions or issues, please create an issue in the repository.


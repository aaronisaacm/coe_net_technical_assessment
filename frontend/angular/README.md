# 📚 BookLoan Management System

A modern web application for managing book loans, built with Angular 19. This system allows libraries or organizations to efficiently track books, borrowers, and loan transactions.

![Version](https://img.shields.io/badge/version-2025.05.23-blue)
![Angular](https://img.shields.io/badge/Angular-19.2.13-red)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-purple)
![License](https://img.shields.io/badge/license-Private-lightgrey)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Available Routes](#available-routes)
- [Components](#components)
- [Services](#services)
- [Models](#models)
- [Development](#development)
- [Testing](#testing)
- [Build](#build)
- [Contributing](#contributing)

## 🎯 Overview

BookLoan is a comprehensive library management system that enables efficient tracking and management of:
- **Books**: Complete catalog with author information and descriptions
- **Borrowers (Persons)**: Member database with contact information
- **Loans**: Active and historical loan transactions
- **Overdue Tracking**: Automatic identification of overdue books
- **Availability**: Real-time book availability status

## ✨ Features

### 📖 Book Management
- ✅ Create, read, update, and delete books
- ✅ Search books by name or author
- ✅ View book availability status
- ✅ Track active loans per book

### 👥 Person Management
- ✅ Manage borrower information
- ✅ Search borrowers by name
- ✅ View borrowing history per person
- ✅ Track active loans per borrower

### 🔄 Loan Management
- ✅ Create new book loans
- ✅ Process book returns
- ✅ Track due dates
- ✅ View overdue loans
- ✅ Complete loan history
- ✅ Check book availability before lending

### 🎨 User Interface
- ✅ Responsive design with Bootstrap 5
- ✅ Modern sidebar navigation
- ✅ Dashboard with key metrics
- ✅ Real-time filtering and search
- ✅ Mobile-friendly interface

### 🔐 Security
- ✅ Authentication system with login
- ✅ Route guards for protected pages
- ✅ Basic authentication for API calls
- ✅ Session management

## 🛠 Technology Stack

### Frontend
- **Framework**: Angular 19.2.13
- **Styling**: Bootstrap 5.3.8
- **Language**: TypeScript 5.8.3
- **HTTP Client**: Angular HttpClient with RxJS 7.8.2

### Development Tools
- **Package Manager**: npm
- **Build Tool**: Angular CLI 19.2.13
- **Testing**: Jasmine 5.7.1 & Karma 6.4.4

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Angular CLI**: v19.x (optional, but recommended)

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Install Angular CLI globally (optional)
npm install -g @angular/cli
```

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd BookLoan/frontend/angular
```

2. **Install dependencies**
```bash
npm install
```

3. **Verify installation**
```bash
npm list
```

## ⚙️ Configuration

### Environment Settings

The application uses environment files for configuration:

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7189/api',
  auth: {
    username: 'admin',
    password: 'admin123'
  }
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://your-production-api.com/api',
  auth: {
    username: 'your-username',
    password: 'your-password'
  }
};
```

> ⚠️ **Security Note**: Never commit sensitive credentials to version control. Use environment variables or secure vaults in production.

### Backend API

Ensure your backend API is running and accessible at the configured `apiBaseUrl`. The API should implement the following endpoints:

- `/api/Book` - Book management
- `/api/Person` - Person management
- `/api/BookLoan` - Loan management

## 🏃 Running the Application

### Development Server
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any source files.

### Development with Auto-Reload
```bash
npm run watch
```

### Custom Port
```bash
ng serve --port 4300
```

## 📁 Project Structure

```
angular/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   └── sidebar/         # Sidebar navigation component
│   │   ├── guards/              # Route guards
│   │   │   └── auth.guard.ts    # Authentication guard
│   │   ├── models/              # TypeScript interfaces
│   │   │   ├── book.interface.ts
│   │   │   ├── person.interface.ts
│   │   │   ├── book-loan.interface.ts
│   │   │   ├── bookResponse.interface.ts
│   │   │   └── index.ts         # Barrel exports
│   │   ├── pages/               # Page components
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── books/           # Book management page
│   │   │   ├── persons/         # Person management page
│   │   │   ├── book-loans/      # Loan management page
│   │   │   ├── login/           # Login page
│   │   │   ├── home/            # Home page
│   │   │   ├── about/           # About page
│   │   │   └── page-not-found/  # 404 page
│   │   ├── pipes/               # Custom pipes
│   │   │   └── filter.pipe.ts   # Data filtering pipe
│   │   ├── services/            # Angular services
│   │   │   ├── auth.service.ts       # Authentication service
│   │   │   ├── book.service.ts       # Book API service
│   │   │   ├── person.service.ts     # Person API service
│   │   │   ├── book-loan.service.ts  # Loan API service
│   │   │   └── index.ts              # Barrel exports
│   │   ├── app.component.*      # Root component
│   │   ├── app.config.ts        # App configuration
│   │   └── app.routes.ts        # Routing configuration
│   ├── assets/                  # Static assets
│   │   ├── favicon.ico
│   │   ├── sidebar-banner.png
│   │   └── ...
│   ├── environments/            # Environment configurations
│   │   ├── environment.ts       # Development environment
│   │   └── environment.prod.ts  # Production environment
│   ├── index.html               # Main HTML file
│   ├── main.ts                  # Application entry point
│   └── styles.css               # Global styles
├── angular.json                 # Angular CLI configuration
├── package.json                 # NPM dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## 🔌 API Endpoints

### Books API (`/api/Book`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Book` | Get all books |
| GET | `/api/Book/{id}` | Get book by ID |
| GET | `/api/Book/author/{author}` | Get books by author |
| GET | `/api/Book/name/{bookName}` | Get book by name |
| POST | `/api/Book` | Create new book |
| PUT | `/api/Book/{id}` | Update book |
| DELETE | `/api/Book/{id}` | Delete book |

### Persons API (`/api/Person`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Person` | Get all persons |
| GET | `/api/Person/{id}` | Get person by ID |
| GET | `/api/Person/search/{searchTerm}` | Search persons |
| GET | `/api/Person/byname?name={name}&lastName={lastName}` | Get person by name |
| POST | `/api/Person` | Create new person |
| PUT | `/api/Person/{id}` | Update person |
| DELETE | `/api/Person/{id}` | Delete person |

### Book Loans API (`/api/BookLoan`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/BookLoan` | Get all book loans |
| GET | `/api/BookLoan/{id}` | Get loan by ID |
| GET | `/api/BookLoan/person/{personId}/active` | Get active loans by person |
| GET | `/api/BookLoan/person/{personId}/history` | Get loan history by person |
| GET | `/api/BookLoan/book/{bookId}/active` | Get active loans by book |
| GET | `/api/BookLoan/book/{bookId}/available` | Check book availability |
| GET | `/api/BookLoan/overdue` | Get overdue loans |
| GET | `/api/BookLoan/returned` | Get returned loans |
| GET | `/api/BookLoan/{id}/returned` | Check if loan is returned |
| POST | `/api/BookLoan` | Create new loan |
| PUT | `/api/BookLoan/{id}` | Update loan |
| PUT | `/api/BookLoan/{id}/return` | Return book |
| DELETE | `/api/BookLoan/{id}` | Delete loan |

## 🔐 Authentication

The application uses a simple authentication system:

1. **Login Page** (`/login`): Users authenticate with credentials
2. **Auth Guard**: Protects routes from unauthorized access
3. **Auth Service**: Manages authentication state and session
4. **Basic Auth**: API calls include Basic Authentication headers

### Login Credentials (Development)
- **Username**: admin
- **Password**: admin123

> ⚠️ Change these credentials in production!

## 🗺️ Available Routes

| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/login` | LoginComponent | ❌ | User login page |
| `/` | → `/dashboard` | ✅ | Redirects to dashboard |
| `/dashboard` | DashboardComponent | ✅ | Main dashboard |
| `/books` | BooksComponent | ✅ | Book management |
| `/persons` | PersonsComponent | ✅ | Person management |
| `/book-loans` | BookLoansComponent | ✅ | Loan management |
| `/home` | HomeComponent | ✅ | Home page |
| `/about` | AboutComponent | ✅ | About page |
| `/**` | PageNotFoundComponent | ❌ | 404 error page |

## 🧩 Components

### Core Components
- **AppComponent**: Root component with main layout
- **SidebarComponent**: Navigation sidebar

### Page Components
- **DashboardComponent**: Overview with key metrics
- **BooksComponent**: Book CRUD operations
- **PersonsComponent**: Person CRUD operations
- **BookLoansComponent**: Loan management interface
- **LoginComponent**: User authentication
- **HomeComponent**: Landing page
- **AboutComponent**: Application information
- **PageNotFoundComponent**: 404 error handling

## 🔧 Services

### BookService
Handles all book-related API operations:
- `getAllBooks()`: Fetch all books
- `getBookById(id)`: Get specific book
- `getBooksByAuthor(author)`: Filter by author
- `getBookByName(name)`: Search by name
- `createBook(book)`: Add new book
- `updateBook(id, book)`: Update existing book
- `deleteBook(id)`: Remove book

### PersonService
Manages person/borrower data:
- `getAllPersons()`: Fetch all persons
- `getPersonById(id)`: Get specific person
- `searchPersons(term)`: Search functionality
- `getPersonByName(name, lastName)`: Find by full name
- `createPerson(person)`: Add new person
- `updatePerson(id, person)`: Update existing person
- `deletePerson(id)`: Remove person

### BookLoanService
Handles loan transactions:
- `getAllBookLoans()`: Fetch all loans
- `getBookLoanById(id)`: Get specific loan
- `getActiveLoansbyPerson(personId)`: Person's active loans
- `getLoanHistoryByPerson(personId)`: Person's loan history
- `getActiveLoansbyBook(bookId)`: Book's active loans
- `checkBookAvailability(bookId)`: Availability status
- `getOverdueLoans()`: List overdue loans
- `getReturnedLoans()`: List returned loans
- `createBookLoan(loan)`: Create new loan
- `updateBookLoan(id, loan)`: Update loan
- `returnBook(id, returnDate?)`: Process return
- `deleteBookLoan(id)`: Remove loan

### AuthService
Authentication management:
- `login(username, password)`: User authentication
- `logout()`: End session
- `isAuthenticated()`: Check auth status

## 📊 Models

### Book Interface
```typescript
interface Book {
  bookId: number;
  bookName: string;
  description: string;
  author: string;
}
```

### Person Interface
```typescript
interface Person {
  personId: number;
  name: string;
  lastName: string;
}
```

### BookLoan Interface
```typescript
interface BookLoan {
  bookLoanId: number;
  personId: number;
  bookId: number;
  loanDate: string;
  returnDate: string | null;
  dueDate: string;
  isReturned: boolean;
  isOverdue: boolean;
  person?: Person | null;
  book?: Book | null;
}
```

## 👨‍💻 Development

### Code Scaffolding

Generate new components:
```bash
ng generate component component-name
```

Generate new service:
```bash
ng generate service service-name
```

Generate new pipe:
```bash
ng generate pipe pipe-name
```

### Development Guidelines

1. **TypeScript**: Use strict typing
2. **RxJS**: Unsubscribe from observables to prevent memory leaks
3. **Error Handling**: Implement proper error handling in services
4. **Responsive Design**: Ensure mobile compatibility
5. **Code Style**: Follow Angular style guide

### Common Development Tasks

**Add a new page:**
```bash
ng generate component pages/new-page
# Update app.routes.ts with new route
```

**Add a new service:**
```bash
ng generate service services/new-service
# Provide in root: providedIn: 'root'
```

## 🧪 Testing

### Test Suite Overview

The application includes **251 comprehensive unit tests** covering all services and components:

**Services (85 tests):**
- ✅ **AuthService**: 13 tests
- ✅ **BookService**: 21 tests  
- ✅ **PersonService**: 21 tests
- ✅ **BookLoanService**: 30 tests

**Page Components (166 tests):**
- ✅ **DashboardComponent**: 31 tests
- ✅ **BooksComponent**: 39 tests
- ✅ **PersonsComponent**: 39 tests
- ✅ **BookLoansComponent**: 40 tests
- ✅ **LoginComponent**: 13 tests
- ✅ **HomeComponent**: 3 tests
- ✅ **AboutComponent**: 3 tests
- ✅ **PageNotFoundComponent**: 3 tests

**Current Status**: 🎉 All tests passing!

### Run All Tests
```bash
npm test
# or
ng test
```

### Run Service Tests Only
```bash
npm test -- --include='**/*.service.spec.ts' --watch=false
```

### Run Tests Once (CI/CD)
```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

### Run Specific Service Tests
```bash
# Auth Service tests
ng test --include='**/auth.service.spec.ts'

# Book Service tests
ng test --include='**/book.service.spec.ts'

# Person Service tests
ng test --include='**/person.service.spec.ts'

# Book Loan Service tests
ng test --include='**/book-loan.service.spec.ts'
```

### Test Coverage
```bash
ng test --code-coverage
```

Coverage reports will be generated in the `coverage/` directory.

### Test Features

The test suite includes:
- ✅ HTTP request/response mocking
- ✅ Error handling scenarios (4xx, 5xx)
- ✅ Authorization header validation
- ✅ CRUD operations testing
- ✅ Observable behavior testing
- ✅ Edge case coverage
- ✅ Client/Server error handling

For detailed test documentation, see [TEST-SUMMARY.md](TEST-SUMMARY.md).

## 🏗️ Build

### Development Build
```bash
npm run build
# or
ng build
```

Build artifacts will be stored in the `dist/` directory.

### Production Build
```bash
ng build --configuration production
```

Production build optimizations:
- ✅ Ahead-of-Time (AOT) compilation
- ✅ Tree-shaking for smaller bundles
- ✅ Minification and uglification
- ✅ Dead code elimination

### Build with Watch Mode
```bash
npm run watch
```

## 📈 Future Enhancements

- [ ] Email notifications for overdue books
- [ ] Advanced search and filtering
- [ ] Book reservation system
- [ ] Multi-user roles (admin, librarian, user)
- [ ] Book cover images
- [ ] Barcode scanning
- [ ] Report generation
- [ ] Export to PDF/Excel
- [ ] Fine calculation for late returns
- [ ] User profile management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Authors

- **Aaron Isaac** - *Initial work*

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Bootstrap for the UI components
- All contributors and testers

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

**Made with ❤️ using Angular 19**


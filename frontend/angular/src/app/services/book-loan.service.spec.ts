import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookLoanService } from './book-loan.service';
import { BookLoan } from '../models';
import {
  BookAvailabilityResponse,
  LoanReturnStatusResponse,
  BookReturnResponse,
  CreateBookLoanRequest,
  UpdateBookLoanRequest
} from '../models/bookResponse.interface';
import { environment } from '../../environments/environment';

describe('BookLoanService', () => {
  let service: BookLoanService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/BookLoan`;

  const mockBookLoan: BookLoan = {
    bookLoanId: 1,
    personId: 1,
    bookId: 1,
    loanDate: '2024-01-01',
    returnDate: null,
    dueDate: '2024-01-15',
    isReturned: false,
    isOverdue: false,
    person: { personId: 1, name: 'John', lastName: 'Doe' },
    book: { bookId: 1, bookName: 'Test Book', description: 'Test', author: 'Test Author' }
  };

  const mockBookLoans: BookLoan[] = [
    mockBookLoan,
    {
      bookLoanId: 2,
      personId: 2,
      bookId: 2,
      loanDate: '2024-01-05',
      returnDate: '2024-01-20',
      dueDate: '2024-01-19',
      isReturned: true,
      isOverdue: false,
      person: { personId: 2, name: 'Jane', lastName: 'Smith' },
      book: { bookId: 2, bookName: 'Another Book', description: 'Test', author: 'Another Author' }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookLoanService]
    });
    service = TestBed.inject(BookLoanService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllBookLoans', () => {
    it('should return an array of book loans', () => {
      service.getAllBookLoans().subscribe(loans => {
        expect(loans).toEqual(mockBookLoans);
        expect(loans.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockBookLoans);
    });

    it('should handle error when fetching all loans', () => {
      service.getAllBookLoans().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 500');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getBookLoanById', () => {
    it('should return a single book loan', () => {
      const loanId = 1;

      service.getBookLoanById(loanId).subscribe(loan => {
        expect(loan).toEqual(mockBookLoan);
      });

      const req = httpMock.expectOne(`${apiUrl}/${loanId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBookLoan);
    });

    it('should handle 404 error when loan not found', () => {
      const loanId = 999;

      service.getBookLoanById(loanId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${loanId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getActiveLoansbyPerson', () => {
    it('should return active loans for a person', () => {
      const personId = 1;

      service.getActiveLoansbyPerson(personId).subscribe(loans => {
        expect(loans).toEqual([mockBookLoan]);
      });

      const req = httpMock.expectOne(`${apiUrl}/person/${personId}/active`);
      expect(req.request.method).toBe('GET');
      req.flush([mockBookLoan]);
    });

    it('should return empty array when person has no active loans', () => {
      const personId = 1;

      service.getActiveLoansbyPerson(personId).subscribe(loans => {
        expect(loans).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}/person/${personId}/active`);
      req.flush([]);
    });
  });

  describe('getLoanHistoryByPerson', () => {
    it('should return loan history for a person', () => {
      const personId = 1;

      service.getLoanHistoryByPerson(personId).subscribe(loans => {
        expect(loans).toEqual(mockBookLoans);
      });

      const req = httpMock.expectOne(`${apiUrl}/person/${personId}/history`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBookLoans);
    });
  });

  describe('getActiveLoansbyBook', () => {
    it('should return active loans for a book', () => {
      const bookId = 1;

      service.getActiveLoansbyBook(bookId).subscribe(loans => {
        expect(loans).toEqual([mockBookLoan]);
      });

      const req = httpMock.expectOne(`${apiUrl}/book/${bookId}/active`);
      expect(req.request.method).toBe('GET');
      req.flush([mockBookLoan]);
    });
  });

  describe('checkBookAvailability', () => {
    it('should return book availability status', () => {
      const bookId = 1;
      const availabilityResponse: BookAvailabilityResponse = {
        bookId: bookId,
        isAvailable: true
      };

      service.checkBookAvailability(bookId).subscribe(response => {
        expect(response).toEqual(availabilityResponse);
        expect(response.isAvailable).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/book/${bookId}/available`);
      expect(req.request.method).toBe('GET');
      req.flush(availabilityResponse);
    });

    it('should return unavailable status when book is loaned', () => {
      const bookId = 1;
      const availabilityResponse: BookAvailabilityResponse = {
        bookId: bookId,
        isAvailable: false
      };

      service.checkBookAvailability(bookId).subscribe(response => {
        expect(response.isAvailable).toBeFalsy();
      });

      const req = httpMock.expectOne(`${apiUrl}/book/${bookId}/available`);
      req.flush(availabilityResponse);
    });
  });

  describe('getOverdueLoans', () => {
    it('should return overdue loans', () => {
      const overdueLoans: BookLoan[] = [{
        ...mockBookLoan,
        isOverdue: true,
        dueDate: '2023-12-01'
      }];

      service.getOverdueLoans().subscribe(loans => {
        expect(loans).toEqual(overdueLoans);
        expect(loans[0].isOverdue).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/overdue`);
      expect(req.request.method).toBe('GET');
      req.flush(overdueLoans);
    });
  });

  describe('getReturnedLoans', () => {
    it('should return returned loans', () => {
      const returnedLoans = mockBookLoans.filter(loan => loan.isReturned);

      service.getReturnedLoans().subscribe(loans => {
        expect(loans.every(loan => loan.isReturned)).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/returned`);
      expect(req.request.method).toBe('GET');
      req.flush(returnedLoans);
    });
  });

  describe('checkLoanReturnStatus', () => {
    it('should return loan return status', () => {
      const loanId = 1;
      const statusResponse: LoanReturnStatusResponse = {
        loanId: loanId,
        isReturned: false
      };

      service.checkLoanReturnStatus(loanId).subscribe(response => {
        expect(response).toEqual(statusResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/${loanId}/returned`);
      expect(req.request.method).toBe('GET');
      req.flush(statusResponse);
    });
  });

  describe('createBookLoan', () => {
    it('should create a new book loan', () => {
      const newLoan: CreateBookLoanRequest = {
        personId: 1,
        bookId: 1,
        loanDate: '2024-01-01',
        dueDate: '2024-01-15'
      };

      service.createBookLoan(newLoan).subscribe(loan => {
        expect(loan.bookLoanId).toBeDefined();
        expect(loan.personId).toBe(newLoan.personId);
        expect(loan.bookId).toBe(newLoan.bookId);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newLoan);
      req.flush({ ...mockBookLoan, ...newLoan });
    });

    it('should handle error when book is not available', () => {
      const newLoan: CreateBookLoanRequest = {
        personId: 1,
        bookId: 1,
        loanDate: '2024-01-01',
        dueDate: '2024-01-15'
      };

      service.createBookLoan(newLoan).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 409');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Book not available', { status: 409, statusText: 'Conflict' });
    });

    it('should handle validation errors', () => {
      const invalidLoan: CreateBookLoanRequest = {
        personId: 0,
        bookId: 0,
        loanDate: '',
        dueDate: ''
      };

      service.createBookLoan(invalidLoan).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 400');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Validation error', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateBookLoan', () => {
    it('should update an existing book loan', () => {
      const loanId = 1;
      const updateRequest: UpdateBookLoanRequest = {
        bookLoanId: loanId,
        personId: 1,
        bookId: 1,
        loanDate: '2024-01-01',
        returnDate: null,
        dueDate: '2024-01-20',
        isReturned: false
      };

      const updatedLoan = { ...mockBookLoan, dueDate: '2024-01-20' };

      service.updateBookLoan(loanId, updateRequest).subscribe(loan => {
        expect(loan.dueDate).toBe('2024-01-20');
      });

      const req = httpMock.expectOne(`${apiUrl}/${loanId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateRequest);
      req.flush(updatedLoan);
    });

    it('should handle error when updating non-existent loan', () => {
      const loanId = 999;
      const updateRequest: UpdateBookLoanRequest = {
        bookLoanId: loanId,
        personId: 1,
        bookId: 1,
        loanDate: '2024-01-01',
        returnDate: null,
        dueDate: '2024-01-20',
        isReturned: false
      };

      service.updateBookLoan(loanId, updateRequest).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${loanId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('returnBook', () => {
    it('should return a book without custom return date', () => {
      const loanId = 1;
      const returnResponse: BookReturnResponse = {
        message: 'Book returned successfully',
        loanId: loanId,
        returnDate: '2024-01-10'
      };

      service.returnBook(loanId).subscribe(response => {
        expect(response).toEqual(returnResponse);
        expect(response.returnDate).toBeDefined();
        expect(response.message).toBeDefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/${loanId}/return`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toBe('null');
      req.flush(returnResponse);
    });

    it('should return a book with custom return date', () => {
      const loanId = 1;
      const returnDate = '2024-01-10';
      const returnResponse: BookReturnResponse = {
        message: 'Book returned successfully',
        loanId: loanId,
        returnDate: returnDate
      };

      service.returnBook(loanId, returnDate).subscribe(response => {
        expect(response.returnDate).toBe(returnDate);
        expect(response.message).toBeDefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/${loanId}/return`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toBe(`"${returnDate}"`);
      req.flush(returnResponse);
    });

    it('should return response with message', () => {
      const loanId = 1;
      const returnResponse: BookReturnResponse = {
        message: 'Book returned late',
        loanId: loanId,
        returnDate: '2024-01-20'
      };

      service.returnBook(loanId).subscribe(response => {
        expect(response.message).toBe('Book returned late');
      });

      const req = httpMock.expectOne(`${apiUrl}/${loanId}/return`);
      req.flush(returnResponse);
    });

    it('should handle error when returning already returned book', () => {
      const loanId = 1;

      service.returnBook(loanId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 400');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${loanId}/return`);
      req.flush('Book already returned', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteBookLoan', () => {
    it('should delete a book loan', () => {
      const loanId = 1;

      service.deleteBookLoan(loanId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${loanId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deleting non-existent loan', () => {
      const loanId = 999;

      service.deleteBookLoan(loanId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${loanId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Authorization Headers', () => {
    it('should include Basic Auth header in all requests', () => {
      service.getAllBookLoans().subscribe();

      const req = httpMock.expectOne(apiUrl);
      const authHeader = req.request.headers.get('Authorization');
      expect(authHeader).toBeTruthy();
      expect(authHeader).toContain('Basic');
      req.flush([]);
    });

    it('should encode credentials correctly', () => {
      service.getAllBookLoans().subscribe();

      const req = httpMock.expectOne(apiUrl);
      const authHeader = req.request.headers.get('Authorization');
      const expectedCredentials = btoa(`${environment.auth.username}:${environment.auth.password}`);
      expect(authHeader).toBe(`Basic ${expectedCredentials}`);
      req.flush([]);
    });
  });

  describe('Error Handling', () => {
    it('should handle client-side errors', () => {
      const errorEvent = new ErrorEvent('Network error', {
        message: 'Connection failed'
      });

      service.getAllBookLoans().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error:');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(errorEvent);
    });

    it('should handle server-side errors with details', () => {
      const errorResponse = { message: 'Internal server error', details: 'Database connection failed' };

      service.getAllBookLoans().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 500');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(errorResponse, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});


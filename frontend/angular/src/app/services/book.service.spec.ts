import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookService } from './book.service';
import { Book } from '../models';
import { environment } from '../../environments/environment';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/Book`;

  const mockBook: Book = {
    bookId: 1,
    bookName: 'Test Book',
    description: 'Test Description',
    author: 'Test Author'
  };

  const mockBooks: Book[] = [
    mockBook,
    {
      bookId: 2,
      bookName: 'Another Book',
      description: 'Another Description',
      author: 'Another Author'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService]
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllBooks', () => {
    it('should return an array of books', () => {
      service.getAllBooks().subscribe(books => {
        expect(books).toEqual(mockBooks);
        expect(books.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockBooks);
    });

    it('should handle error when fetching all books', () => {
      const errorMessage = 'Server error';

      service.getAllBooks().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 500');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getBookById', () => {
    it('should return a single book', () => {
      const bookId = 1;

      service.getBookById(bookId).subscribe(book => {
        expect(book).toEqual(mockBook);
      });

      const req = httpMock.expectOne(`${apiUrl}/${bookId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush(mockBook);
    });

    it('should handle 404 error when book not found', () => {
      const bookId = 999;

      service.getBookById(bookId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${bookId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getBooksByAuthor', () => {
    it('should return books by author', () => {
      const author = 'Test Author';

      service.getBooksByAuthor(author).subscribe(books => {
        expect(books).toEqual([mockBook]);
        expect(books.length).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/author/${encodeURIComponent(author)}`);
      expect(req.request.method).toBe('GET');
      req.flush([mockBook]);
    });

    it('should encode special characters in author name', () => {
      const author = 'Test Author & Co.';

      service.getBooksByAuthor(author).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/author/${encodeURIComponent(author)}`);
      expect(req.request.urlWithParams).toContain(encodeURIComponent(author));
      req.flush([]);
    });
  });

  describe('getBookByName', () => {
    it('should return a book by name', () => {
      const bookName = 'Test Book';

      service.getBookByName(bookName).subscribe(book => {
        expect(book).toEqual(mockBook);
      });

      const req = httpMock.expectOne(`${apiUrl}/name/${encodeURIComponent(bookName)}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBook);
    });

    it('should encode special characters in book name', () => {
      const bookName = 'Book & Magazine';

      service.getBookByName(bookName).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/name/${encodeURIComponent(bookName)}`);
      expect(req.request.urlWithParams).toContain(encodeURIComponent(bookName));
      req.flush(mockBook);
    });
  });

  describe('createBook', () => {
    it('should create a new book', () => {
      const newBook: Omit<Book, 'bookId'> = {
        bookName: 'New Book',
        description: 'New Description',
        author: 'New Author'
      };

      service.createBook(newBook).subscribe(book => {
        expect(book.bookId).toBeDefined();
        expect(book.bookName).toBe(newBook.bookName);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newBook);
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush({ ...newBook, bookId: 3 });
    });

    it('should handle validation error when creating book', () => {
      const invalidBook: Omit<Book, 'bookId'> = {
        bookName: '',
        description: '',
        author: ''
      };

      service.createBook(invalidBook).subscribe({
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

  describe('updateBook', () => {
    it('should update an existing book', () => {
      const bookId = 1;
      const updatedBook: Book = {
        ...mockBook,
        bookName: 'Updated Book'
      };

      service.updateBook(bookId, updatedBook).subscribe(book => {
        expect(book.bookName).toBe('Updated Book');
      });

      const req = httpMock.expectOne(`${apiUrl}/${bookId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedBook);
      req.flush(updatedBook);
    });

    it('should handle error when updating non-existent book', () => {
      const bookId = 999;

      service.updateBook(bookId, mockBook).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${bookId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', () => {
      const bookId = 1;

      service.deleteBook(bookId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${bookId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush(null);
    });

    it('should handle error when deleting book with active loans', () => {
      const bookId = 1;

      service.deleteBook(bookId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 409');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${bookId}`);
      req.flush('Book has active loans', { status: 409, statusText: 'Conflict' });
    });
  });

  describe('Authorization Headers', () => {
    it('should include Basic Auth header in all requests', () => {
      service.getAllBooks().subscribe();

      const req = httpMock.expectOne(apiUrl);
      const authHeader = req.request.headers.get('Authorization');
      expect(authHeader).toBeTruthy();
      expect(authHeader).toContain('Basic');
      req.flush([]);
    });

    it('should encode credentials correctly', () => {
      service.getAllBooks().subscribe();

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

      service.getAllBooks().subscribe({
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

      service.getAllBooks().subscribe({
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


import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BooksComponent } from './books.component';
import { BookService } from '../../services/book.service';
import { of, throwError } from 'rxjs';
import { Book } from '../../models';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;

  const mockBooks: Book[] = [
    { bookId: 1, bookName: 'Book 1', description: 'Description 1', author: 'Author 1' },
    { bookId: 2, bookName: 'Book 2', description: 'Description 2', author: 'Author 2' },
    { bookId: 3, bookName: 'Another Title', description: 'Description 3', author: 'Author 3' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('BookService', ['getAllBooks', 'createBook', 'updateBook', 'deleteBook']);

    await TestBed.configureTestingModule({
      imports: [BooksComponent],
      providers: [{ provide: BookService, useValue: spy }]
    }).compileComponents();

    bookServiceSpy = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadBooks', () => {
      spyOn(component, 'loadBooks');
      component.ngOnInit();
      expect(component.loadBooks).toHaveBeenCalled();
    });
  });

  describe('loadBooks', () => {
    it('should load books successfully', () => {
      bookServiceSpy.getAllBooks.and.returnValue(of(mockBooks));

      component.loadBooks();

      expect(bookServiceSpy.getAllBooks).toHaveBeenCalled();
      expect(component.books).toEqual(mockBooks);
      expect(component.filteredBooks).toEqual(mockBooks);
      expect(component.loading).toBeFalsy();
      expect(component.error).toBe('');
    });

    it('should set loading to false after successful load', () => {
      bookServiceSpy.getAllBooks.and.returnValue(of(mockBooks));
      component.loadBooks();
      expect(component.loading).toBeFalsy();
    });

    it('should handle error when loading books fails', () => {
      bookServiceSpy.getAllBooks.and.returnValue(throwError(() => new Error('Load error')));
      spyOn(console, 'error');

      component.loadBooks();

      expect(component.error).toBe('Failed to load books. Please try again.');
      expect(component.loading).toBeFalsy();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('searchBooks', () => {
    beforeEach(() => {
      component.books = mockBooks;
      component.filteredBooks = mockBooks;
    });

    it('should show all books when search term is empty', () => {
      component.searchTerm = '';
      component.searchBooks();
      expect(component.filteredBooks).toEqual(mockBooks);
    });

    it('should filter books by book name', () => {
      component.searchTerm = 'Book 1';
      component.searchBooks();
      expect(component.filteredBooks.length).toBe(1);
      expect(component.filteredBooks[0].bookName).toBe('Book 1');
    });

    it('should filter books by author (case insensitive)', () => {
      component.searchTerm = 'author 2';
      component.searchBooks();
      expect(component.filteredBooks.length).toBe(1);
      expect(component.filteredBooks[0].author).toBe('Author 2');
    });

    it('should filter books by description', () => {
      component.searchTerm = 'Description 3';
      component.searchBooks();
      expect(component.filteredBooks.length).toBe(1);
      expect(component.filteredBooks[0].description).toBe('Description 3');
    });

    it('should return empty array when no matches found', () => {
      component.searchTerm = 'NonExistent';
      component.searchBooks();
      expect(component.filteredBooks.length).toBe(0);
    });

    it('should handle whitespace in search term', () => {
      component.searchTerm = '   ';
      component.searchBooks();
      expect(component.filteredBooks).toEqual(mockBooks);
    });
  });

  describe('Modal Management', () => {
    describe('openAddModal', () => {
      it('should open modal in add mode', () => {
        component.openAddModal();
        expect(component.showModal).toBeTruthy();
        expect(component.isEditMode).toBeFalsy();
        expect(component.currentBook).toEqual(component.getEmptyBook());
      });
    });

    describe('openEditModal', () => {
      it('should open modal in edit mode with book data', () => {
        const book = mockBooks[0];
        component.openEditModal(book);
        expect(component.showModal).toBeTruthy();
        expect(component.isEditMode).toBeTruthy();
        expect(component.currentBook).toEqual(book);
      });

      it('should create a copy of the book object', () => {
        const book = mockBooks[0];
        component.openEditModal(book);
        expect(component.currentBook).not.toBe(book);
        expect(component.currentBook).toEqual(book);
      });
    });

    describe('closeModal', () => {
      it('should close modal and reset state', () => {
        component.showModal = true;
        component.currentBook = mockBooks[0];
        component.error = 'Some error';

        component.closeModal();

        expect(component.showModal).toBeFalsy();
        expect(component.currentBook).toEqual(component.getEmptyBook());
        expect(component.error).toBe('');
      });
    });
  });

  describe('validateBook', () => {
    beforeEach(() => {
      component.currentBook = component.getEmptyBook();
    });

    it('should return true for valid book', () => {
      component.currentBook = {
        bookId: 0,
        bookName: 'Valid Book',
        author: 'Valid Author',
        description: 'Valid Description'
      };
      expect(component.validateBook()).toBeTruthy();
      expect(component.error).toBe('');
    });

    it('should return false and set error when book name is empty', () => {
      component.currentBook.bookName = '';
      expect(component.validateBook()).toBeFalsy();
      expect(component.error).toBe('Book name is required');
    });

    it('should return false when book name is only whitespace', () => {
      component.currentBook.bookName = '   ';
      component.currentBook.author = 'Author';
      component.currentBook.description = 'Desc';
      expect(component.validateBook()).toBeFalsy();
      expect(component.error).toBe('Book name is required');
    });

    it('should return false and set error when author is empty', () => {
      component.currentBook.bookName = 'Book';
      component.currentBook.author = '';
      expect(component.validateBook()).toBeFalsy();
      expect(component.error).toBe('Author is required');
    });

    it('should return false and set error when description is empty', () => {
      component.currentBook.bookName = 'Book';
      component.currentBook.author = 'Author';
      component.currentBook.description = '';
      expect(component.validateBook()).toBeFalsy();
      expect(component.error).toBe('Description is required');
    });
  });

  describe('saveBook', () => {
    beforeEach(() => {
      component.currentBook = {
        bookId: 0,
        bookName: 'Test Book',
        author: 'Test Author',
        description: 'Test Description'
      };
    });

    it('should call createBook when in add mode', () => {
      component.isEditMode = false;
      spyOn(component, 'createBook');
      component.saveBook();
      expect(component.createBook).toHaveBeenCalled();
    });

    it('should call updateBook when in edit mode', () => {
      component.isEditMode = true;
      spyOn(component, 'updateBook');
      component.saveBook();
      expect(component.updateBook).toHaveBeenCalled();
    });

    it('should not save if validation fails', () => {
      component.currentBook.bookName = '';
      spyOn(component, 'createBook');
      spyOn(component, 'updateBook');

      component.saveBook();

      expect(component.createBook).not.toHaveBeenCalled();
      expect(component.updateBook).not.toHaveBeenCalled();
    });
  });

  describe('createBook', () => {
    beforeEach(() => {
      component.books = [...mockBooks];
      component.currentBook = {
        bookId: 0,
        bookName: 'New Book',
        author: 'New Author',
        description: 'New Description'
      };
    });

    it('should create book successfully', () => {
      const newBook: Book = { ...component.currentBook, bookId: 4 };
      bookServiceSpy.createBook.and.returnValue(of(newBook));
      spyOn(component, 'closeModal');
      spyOn(component, 'showSuccessMessage');

      component.createBook();

      expect(bookServiceSpy.createBook).toHaveBeenCalled();
      expect(component.books.length).toBe(4);
      expect(component.showSuccessMessage).toHaveBeenCalledWith('Book created successfully!');
      expect(component.closeModal).toHaveBeenCalled();
      expect(component.loading).toBeFalsy();
    });

    it('should exclude bookId from request', () => {
      const newBook: Book = { bookId: 4, bookName: 'New Book', author: 'New Author', description: 'New Description' };
      bookServiceSpy.createBook.and.returnValue(of(newBook));

      component.createBook();

      const callArgs = bookServiceSpy.createBook.calls.mostRecent().args[0];
      expect('bookId' in callArgs).toBeFalsy();
    });

    it('should handle error when creating book fails', () => {
      bookServiceSpy.createBook.and.returnValue(throwError(() => new Error('Create error')));
      spyOn(console, 'error');

      component.createBook();

      expect(component.error).toBe('Failed to create book. Please try again.');
      expect(component.loading).toBeFalsy();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateBook', () => {
    beforeEach(() => {
      component.books = [...mockBooks];
      component.currentBook = { ...mockBooks[0], bookName: 'Updated Book' };
    });

    it('should update book successfully', () => {
      bookServiceSpy.updateBook.and.returnValue(of(component.currentBook));
      spyOn(component, 'closeModal');
      spyOn(component, 'showSuccessMessage');

      component.updateBook();

      expect(bookServiceSpy.updateBook).toHaveBeenCalledWith(component.currentBook.bookId, component.currentBook);
      expect(component.books[0]).toEqual(component.currentBook);
      expect(component.showSuccessMessage).toHaveBeenCalledWith('Book updated successfully!');
      expect(component.closeModal).toHaveBeenCalled();
      expect(component.loading).toBeFalsy();
    });

    it('should handle error when updating book fails', () => {
      bookServiceSpy.updateBook.and.returnValue(throwError(() => new Error('Update error')));
      spyOn(console, 'error');

      component.updateBook();

      expect(component.error).toBe('Failed to update book. Please try again.');
      expect(component.loading).toBeFalsy();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deleteBook', () => {
    beforeEach(() => {
      component.books = [...mockBooks];
      component.filteredBooks = [...mockBooks];
    });

    it('should delete book after confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      bookServiceSpy.deleteBook.and.returnValue(of(undefined as void));
      spyOn(component, 'showSuccessMessage');

      component.deleteBook(mockBooks[0]);

      expect(window.confirm).toHaveBeenCalled();
      expect(bookServiceSpy.deleteBook).toHaveBeenCalledWith(mockBooks[0].bookId);
      expect(component.books.length).toBe(2);
      expect(component.showSuccessMessage).toHaveBeenCalledWith('Book deleted successfully!');
      expect(component.loading).toBeFalsy();
    });

    it('should not delete book if confirmation is cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deleteBook(mockBooks[0]);

      expect(bookServiceSpy.deleteBook).not.toHaveBeenCalled();
      expect(component.books.length).toBe(3);
    });

    it('should handle error when deleting book fails', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      bookServiceSpy.deleteBook.and.returnValue(throwError(() => new Error('Delete error')));
      spyOn(console, 'error');

      component.deleteBook(mockBooks[0]);

      expect(component.error).toBe('Failed to delete book. Please try again.');
      expect(component.loading).toBeFalsy();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('showSuccessMessage', () => {
    it('should set success message', () => {
      component.showSuccessMessage('Test message');
      expect(component.successMessage).toBe('Test message');
    });

    it('should clear success message after 3 seconds', fakeAsync(() => {
      component.showSuccessMessage('Test message');
      expect(component.successMessage).toBe('Test message');

      tick(3000);

      expect(component.successMessage).toBe('');
    }));
  });

  describe('getEmptyBook', () => {
    it('should return empty book object', () => {
      const emptyBook = component.getEmptyBook();
      expect(emptyBook).toEqual({
        bookId: 0,
        bookName: '',
        author: '',
        description: ''
      });
    });
  });

  describe('component initialization', () => {
    it('should initialize with default values', () => {
      expect(component.books).toEqual([]);
      expect(component.filteredBooks).toEqual([]);
      expect(component.searchTerm).toBe('');
      expect(component.loading).toBeFalsy();
      expect(component.error).toBe('');
      expect(component.successMessage).toBe('');
      expect(component.showModal).toBeFalsy();
      expect(component.isEditMode).toBeFalsy();
    });
  });
});


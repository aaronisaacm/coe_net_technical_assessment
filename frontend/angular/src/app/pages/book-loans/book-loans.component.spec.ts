import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BookLoansComponent } from './book-loans.component';
import { BookLoanService } from '../../services/book-loan.service';
import { BookService } from '../../services/book.service';
import { PersonService } from '../../services/person.service';
import { of, throwError } from 'rxjs';
import { BookLoan, Book, Person } from '../../models';

describe('BookLoansComponent', () => {
  let component: BookLoansComponent;
  let fixture: ComponentFixture<BookLoansComponent>;
  let loanServiceSpy: jasmine.SpyObj<BookLoanService>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;
  let personServiceSpy: jasmine.SpyObj<PersonService>;

  const mockBooks: Book[] = [
    { bookId: 1, bookName: 'Book 1', description: 'Desc 1', author: 'Author 1' },
    { bookId: 2, bookName: 'Book 2', description: 'Desc 2', author: 'Author 2' }
  ];

  const mockPersons: Person[] = [
    { personId: 1, name: 'John', lastName: 'Doe' },
    { personId: 2, name: 'Jane', lastName: 'Smith' }
  ];

  const mockLoans: BookLoan[] = [
    {
      bookLoanId: 1,
      personId: 1,
      bookId: 1,
      loanDate: '2024-01-01',
      returnDate: null,
      dueDate: '2024-01-15',
      isReturned: false,
      isOverdue: false,
      person: mockPersons[0],
      book: mockBooks[0]
    },
    {
      bookLoanId: 2,
      personId: 2,
      bookId: 2,
      loanDate: '2024-01-05',
      returnDate: '2024-01-20',
      dueDate: '2024-01-19',
      isReturned: true,
      isOverdue: false,
      person: mockPersons[1],
      book: mockBooks[1]
    },
    {
      bookLoanId: 3,
      personId: 1,
      bookId: 2,
      loanDate: '2023-12-01',
      returnDate: null,
      dueDate: '2023-12-15',
      isReturned: false,
      isOverdue: true,
      person: mockPersons[0],
      book: mockBooks[1]
    }
  ];

  beforeEach(async () => {
    const loanSpy = jasmine.createSpyObj('BookLoanService', ['getAllBookLoans', 'createBookLoan', 'returnBook', 'deleteBookLoan']);
    const bookSpy = jasmine.createSpyObj('BookService', ['getAllBooks']);
    const personSpy = jasmine.createSpyObj('PersonService', ['getAllPersons']);

    await TestBed.configureTestingModule({
      imports: [BookLoansComponent],
      providers: [
        { provide: BookLoanService, useValue: loanSpy },
        { provide: BookService, useValue: bookSpy },
        { provide: PersonService, useValue: personSpy }
      ]
    }).compileComponents();

    loanServiceSpy = TestBed.inject(BookLoanService) as jasmine.SpyObj<BookLoanService>;
    bookServiceSpy = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    personServiceSpy = TestBed.inject(PersonService) as jasmine.SpyObj<PersonService>;

    fixture = TestBed.createComponent(BookLoansComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadLoans and loadBooksAndPersons', () => {
      spyOn(component, 'loadLoans');
      spyOn(component, 'loadBooksAndPersons');

      component.ngOnInit();

      expect(component.loadLoans).toHaveBeenCalled();
      expect(component.loadBooksAndPersons).toHaveBeenCalled();
    });
  });

  describe('loadLoans', () => {
    it('should load loans successfully', () => {
      loanServiceSpy.getAllBookLoans.and.returnValue(of(mockLoans));
      spyOn(component, 'applyFilters');

      component.loadLoans();

      expect(loanServiceSpy.getAllBookLoans).toHaveBeenCalled();
      expect(component.loans).toEqual(mockLoans);
      expect(component.applyFilters).toHaveBeenCalled();
      expect(component.loading).toBeFalsy();
      expect(component.error).toBe('');
    });

    it('should handle error when loading loans fails', () => {
      loanServiceSpy.getAllBookLoans.and.returnValue(throwError(() => new Error('Load error')));
      spyOn(console, 'error');

      component.loadLoans();

      expect(component.error).toBe('Failed to load loans. Please try again.');
      expect(component.loading).toBeFalsy();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('loadBooksAndPersons', () => {
    it('should load books and persons', () => {
      bookServiceSpy.getAllBooks.and.returnValue(of(mockBooks));
      personServiceSpy.getAllPersons.and.returnValue(of(mockPersons));

      component.loadBooksAndPersons();

      expect(bookServiceSpy.getAllBooks).toHaveBeenCalled();
      expect(personServiceSpy.getAllPersons).toHaveBeenCalled();
      expect(component.books).toEqual(mockBooks);
      expect(component.persons).toEqual(mockPersons);
    });

    it('should handle error when loading books fails', () => {
      bookServiceSpy.getAllBooks.and.returnValue(throwError(() => new Error('Book load error')));
      personServiceSpy.getAllPersons.and.returnValue(of(mockPersons));
      spyOn(console, 'error');

      component.loadBooksAndPersons();

      expect(console.error).toHaveBeenCalledWith('Error loading books:', jasmine.any(Error));
    });

    it('should handle error when loading persons fails', () => {
      bookServiceSpy.getAllBooks.and.returnValue(of(mockBooks));
      personServiceSpy.getAllPersons.and.returnValue(throwError(() => new Error('Person load error')));
      spyOn(console, 'error');

      component.loadBooksAndPersons();

      expect(console.error).toHaveBeenCalledWith('Error loading persons:', jasmine.any(Error));
    });
  });

  describe('applyFilters', () => {
    beforeEach(() => {
      component.loans = mockLoans;
    });

    it('should show all loans when filter is "all"', () => {
      component.filterStatus = 'all';
      component.searchTerm = '';

      component.applyFilters();

      expect(component.filteredLoans.length).toBe(3);
    });

    it('should filter active loans', () => {
      component.filterStatus = 'active';
      component.searchTerm = '';

      component.applyFilters();

      expect(component.filteredLoans.length).toBe(2);
      expect(component.filteredLoans.every(loan => !loan.isReturned)).toBeTruthy();
    });

    it('should filter returned loans', () => {
      component.filterStatus = 'returned';
      component.searchTerm = '';

      component.applyFilters();

      expect(component.filteredLoans.length).toBe(1);
      expect(component.filteredLoans[0].isReturned).toBeTruthy();
    });

    it('should filter overdue loans', () => {
      component.filterStatus = 'overdue';
      component.searchTerm = '';

      component.applyFilters();

      expect(component.filteredLoans.length).toBe(1);
      expect(component.filteredLoans[0].isOverdue).toBeTruthy();
    });

    it('should filter by book name', () => {
      component.filterStatus = 'all';
      component.searchTerm = 'Book 1';

      component.applyFilters();

      expect(component.filteredLoans.length).toBe(1);
      expect(component.filteredLoans[0].book?.bookName).toBe('Book 1');
    });

    it('should filter by person first name', () => {
      component.filterStatus = 'all';
      component.searchTerm = 'Jane';

      component.applyFilters();

      expect(component.filteredLoans.length).toBe(1);
      expect(component.filteredLoans[0].person?.name).toBe('Jane');
    });

    it('should filter by person last name', () => {
      component.filterStatus = 'all';
      component.searchTerm = 'Doe';

      component.applyFilters();

      expect(component.filteredLoans.length).toBe(2);
    });

    it('should combine status and search filters', () => {
      component.filterStatus = 'active';
      component.searchTerm = 'Doe';

      component.applyFilters();

      expect(component.filteredLoans.length).toBe(2);
    });
  });

  describe('onFilterChange', () => {
    it('should call applyFilters', () => {
      spyOn(component, 'applyFilters');
      component.onFilterChange();
      expect(component.applyFilters).toHaveBeenCalled();
    });
  });

  describe('onSearchChange', () => {
    it('should call applyFilters', () => {
      spyOn(component, 'applyFilters');
      component.onSearchChange();
      expect(component.applyFilters).toHaveBeenCalled();
    });
  });

  describe('Modal Management', () => {
    describe('openLoanModal', () => {
      it('should open loan modal with empty loan', () => {
        component.openLoanModal();

        expect(component.showLoanModal).toBeTruthy();
        expect(component.currentLoan).toEqual(component.getEmptyLoan());
      });
    });

    describe('closeLoanModal', () => {
      it('should close loan modal and reset state', () => {
        component.showLoanModal = true;
        component.currentLoan = { personId: '1', bookId: '1' };
        component.error = 'Some error';

        component.closeLoanModal();

        expect(component.showLoanModal).toBeFalsy();
        expect(component.currentLoan).toEqual(component.getEmptyLoan());
        expect(component.error).toBe('');
      });
    });

    describe('openReturnModal', () => {
      it('should open return modal with loan', () => {
        component.openReturnModal(mockLoans[0]);

        expect(component.showReturnModal).toBeTruthy();
        expect(component.selectedLoanForReturn).toEqual(mockLoans[0]);
        expect(component.returnDate).toBeTruthy();
      });
    });

    describe('closeReturnModal', () => {
      it('should close return modal and reset state', () => {
        component.showReturnModal = true;
        component.selectedLoanForReturn = mockLoans[0];
        component.returnDate = '2024-01-20';
        component.error = 'Some error';

        component.closeReturnModal();

        expect(component.showReturnModal).toBeFalsy();
        expect(component.selectedLoanForReturn).toBeUndefined();
        expect(component.returnDate).toBe('');
        expect(component.error).toBe('');
      });
    });
  });

  describe('createLoan', () => {
    beforeEach(() => {
      component.currentLoan = {
        personId: '1',
        bookId: '1',
        loanDate: '2024-01-01',
        dueDate: '2024-01-15'
      };
    });

    it('should create loan successfully', () => {
      loanServiceSpy.createBookLoan.and.returnValue(of(mockLoans[0]));
      loanServiceSpy.getAllBookLoans.and.returnValue(of(mockLoans));
      spyOn(component, 'closeLoanModal');
      spyOn(component, 'showSuccessMessage');
      spyOn(component, 'applyFilters');

      component.createLoan();

      expect(loanServiceSpy.createBookLoan).toHaveBeenCalled();
      expect(component.showSuccessMessage).toHaveBeenCalledWith('Book loan created successfully!');
      expect(component.closeLoanModal).toHaveBeenCalled();
    });

    it('should validate person and book selection', () => {
      component.currentLoan.personId = '';

      component.createLoan();

      expect(component.error).toBe('Please select both a person and a book');
      expect(loanServiceSpy.createBookLoan).not.toHaveBeenCalled();
    });

    it('should validate loan and due dates', () => {
      component.currentLoan.loanDate = '';

      component.createLoan();

      expect(component.error).toBe('Please provide loan and due dates');
      expect(loanServiceSpy.createBookLoan).not.toHaveBeenCalled();
    });

    it('should convert dates to ISO format', () => {
      loanServiceSpy.createBookLoan.and.returnValue(of(mockLoans[0]));
      loanServiceSpy.getAllBookLoans.and.returnValue(of(mockLoans));

      component.createLoan();

      const callArgs = loanServiceSpy.createBookLoan.calls.mostRecent().args[0];
      expect(callArgs.loanDate).toContain('T');
      expect(callArgs.dueDate).toContain('T');
    });

    it('should handle error when creating loan fails', () => {
      loanServiceSpy.createBookLoan.and.returnValue(
        throwError(() => ({ message: 'Book already loaned' }))
      );
      spyOn(console, 'error');

      component.createLoan();

      expect(component.error).toContain('Book already loaned');
      expect(component.loading).toBeFalsy();
    });
  });

  describe('returnBook', () => {
    beforeEach(() => {
      component.selectedLoanForReturn = mockLoans[0];
      component.returnDate = '2024-01-20';
    });

    it('should return book successfully', () => {
      const returnResponse = { message: 'Returned', loanId: 1, returnDate: '2024-01-20' };
      loanServiceSpy.returnBook.and.returnValue(of(returnResponse));
      loanServiceSpy.getAllBookLoans.and.returnValue(of(mockLoans));
      spyOn(component, 'closeReturnModal');
      spyOn(component, 'showSuccessMessage');
      spyOn(component, 'applyFilters');

      component.returnBook();

      expect(loanServiceSpy.returnBook).toHaveBeenCalledWith(1, jasmine.any(String));
      expect(component.showSuccessMessage).toHaveBeenCalledWith('Book returned successfully!');
      expect(component.closeReturnModal).toHaveBeenCalled();
    });

    it('should not return if no loan selected', () => {
      component.selectedLoanForReturn = undefined;

      component.returnBook();

      expect(loanServiceSpy.returnBook).not.toHaveBeenCalled();
    });

    it('should convert return date to ISO format', () => {
      const returnResponse = { message: 'Returned', loanId: 1, returnDate: '2024-01-20' };
      loanServiceSpy.returnBook.and.returnValue(of(returnResponse));
      loanServiceSpy.getAllBookLoans.and.returnValue(of(mockLoans));

      component.returnBook();

      const callArgs = loanServiceSpy.returnBook.calls.mostRecent().args[1];
      expect(callArgs).toContain('T');
    });

    it('should handle error when returning book fails', () => {
      loanServiceSpy.returnBook.and.returnValue(throwError(() => new Error('Return error')));
      spyOn(console, 'error');

      component.returnBook();

      expect(component.error).toBe('Failed to return book. Please try again.');
      expect(component.loading).toBeFalsy();
    });
  });

  describe('deleteLoan', () => {
    it('should delete loan after confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      loanServiceSpy.deleteBookLoan.and.returnValue(of(undefined as void));
      loanServiceSpy.getAllBookLoans.and.returnValue(of(mockLoans));
      spyOn(component, 'showSuccessMessage');
      spyOn(component, 'applyFilters');

      component.deleteLoan(mockLoans[0]);

      expect(window.confirm).toHaveBeenCalled();
      expect(loanServiceSpy.deleteBookLoan).toHaveBeenCalledWith(1);
      expect(component.showSuccessMessage).toHaveBeenCalledWith('Loan record deleted successfully!');
    });

    it('should not delete if confirmation is cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deleteLoan(mockLoans[0]);

      expect(loanServiceSpy.deleteBookLoan).not.toHaveBeenCalled();
    });

    it('should handle error when deleting loan fails', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      loanServiceSpy.deleteBookLoan.and.returnValue(throwError(() => new Error('Delete error')));
      spyOn(console, 'error');

      component.deleteLoan(mockLoans[0]);

      expect(component.error).toBe('Failed to delete loan. Please try again.');
      expect(component.loading).toBeFalsy();
    });
  });

  describe('Helper Methods', () => {
    describe('getStatusBadgeClass', () => {
      it('should return bg-danger for overdue loans', () => {
        expect(component.getStatusBadgeClass(mockLoans[2])).toBe('bg-danger');
      });

      it('should return bg-success for returned loans', () => {
        expect(component.getStatusBadgeClass(mockLoans[1])).toBe('bg-success');
      });

      it('should return bg-warning for active loans', () => {
        expect(component.getStatusBadgeClass(mockLoans[0])).toBe('bg-warning');
      });
    });

    describe('getStatusText', () => {
      it('should return OVERDUE for overdue loans', () => {
        expect(component.getStatusText(mockLoans[2])).toBe('OVERDUE');
      });

      it('should return RETURNED for returned loans', () => {
        expect(component.getStatusText(mockLoans[1])).toBe('RETURNED');
      });

      it('should return ACTIVE for active loans', () => {
        expect(component.getStatusText(mockLoans[0])).toBe('ACTIVE');
      });
    });

    describe('formatDate', () => {
      it('should format date string to local date', () => {
        const dateString = '2024-01-15';
        const formattedDate = component.formatDate(dateString);
        const expectedDate = new Date(dateString).toLocaleDateString();
        expect(formattedDate).toBe(expectedDate);
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

    describe('getEmptyLoan', () => {
      it('should return empty loan with default dates', () => {
        const emptyLoan = component.getEmptyLoan();

        expect(emptyLoan.personId).toBe('');
        expect(emptyLoan.bookId).toBe('');
        expect(emptyLoan.loanDate).toBeTruthy();
        expect(emptyLoan.dueDate).toBeTruthy();
      });

      it('should set due date 14 days from today', () => {
        const emptyLoan = component.getEmptyLoan();
        const loanDate = new Date(emptyLoan.loanDate);
        const dueDate = new Date(emptyLoan.dueDate);

        const daysDiff = (dueDate.getTime() - loanDate.getTime()) / (1000 * 60 * 60 * 24);
        expect(daysDiff).toBe(14);
      });
    });
  });

  describe('component initialization', () => {
    it('should initialize with default values', () => {
      expect(component.loans).toEqual([]);
      expect(component.filteredLoans).toEqual([]);
      expect(component.books).toEqual([]);
      expect(component.persons).toEqual([]);
      expect(component.loading).toBeFalsy();
      expect(component.error).toBe('');
      expect(component.successMessage).toBe('');
      expect(component.filterStatus).toBe('all');
      expect(component.searchTerm).toBe('');
      expect(component.showLoanModal).toBeFalsy();
      expect(component.showReturnModal).toBeFalsy();
    });
  });
});


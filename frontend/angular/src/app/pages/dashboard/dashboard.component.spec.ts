import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { BookService } from '../../services/book.service';
import { PersonService } from '../../services/person.service';
import { BookLoanService } from '../../services/book-loan.service';
import { of, throwError } from 'rxjs';
import { Book, Person, BookLoan } from '../../models';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let bookServiceSpy: jasmine.SpyObj<BookService>;
  let personServiceSpy: jasmine.SpyObj<PersonService>;
  let loanServiceSpy: jasmine.SpyObj<BookLoanService>;

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
    }
  ];

  const mockOverdueLoans: BookLoan[] = [
    {
      bookLoanId: 3,
      personId: 1,
      bookId: 1,
      loanDate: '2023-12-01',
      returnDate: null,
      dueDate: '2023-12-15',
      isReturned: false,
      isOverdue: true,
      person: mockPersons[0],
      book: mockBooks[0]
    }
  ];

  beforeEach(async () => {
    const bookSpy = jasmine.createSpyObj('BookService', ['getAllBooks']);
    const personSpy = jasmine.createSpyObj('PersonService', ['getAllPersons']);
    const loanSpy = jasmine.createSpyObj('BookLoanService', ['getAllBookLoans', 'getOverdueLoans']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: BookService, useValue: bookSpy },
        { provide: PersonService, useValue: personSpy },
        { provide: BookLoanService, useValue: loanSpy }
      ]
    }).compileComponents();

    bookServiceSpy = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    personServiceSpy = TestBed.inject(PersonService) as jasmine.SpyObj<PersonService>;
    loanServiceSpy = TestBed.inject(BookLoanService) as jasmine.SpyObj<BookLoanService>;

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadDashboardData', () => {
      spyOn(component, 'loadDashboardData');
      component.ngOnInit();
      expect(component.loadDashboardData).toHaveBeenCalled();
    });
  });

  describe('loadDashboardData', () => {
    beforeEach(() => {
      bookServiceSpy.getAllBooks.and.returnValue(of(mockBooks));
      personServiceSpy.getAllPersons.and.returnValue(of(mockPersons));
      loanServiceSpy.getAllBookLoans.and.returnValue(of(mockLoans));
      loanServiceSpy.getOverdueLoans.and.returnValue(of(mockOverdueLoans));
    });

    it('should call all service methods', () => {
      component.loadDashboardData();
      expect(bookServiceSpy.getAllBooks).toHaveBeenCalled();
      expect(personServiceSpy.getAllPersons).toHaveBeenCalled();
      expect(loanServiceSpy.getAllBookLoans).toHaveBeenCalled();
      expect(loanServiceSpy.getOverdueLoans).toHaveBeenCalled();
    });

    it('should load total books count', (done) => {
      component.loadDashboardData();

      setTimeout(() => {
        expect(bookServiceSpy.getAllBooks).toHaveBeenCalled();
        expect(component.totalBooks).toBe(2);
        done();
      }, 100);
    });

    it('should load total persons count', (done) => {
      component.loadDashboardData();

      setTimeout(() => {
        expect(personServiceSpy.getAllPersons).toHaveBeenCalled();
        expect(component.totalPersons).toBe(2);
        done();
      }, 100);
    });

    it('should load total loans and active loans count', (done) => {
      component.loadDashboardData();

      setTimeout(() => {
        expect(loanServiceSpy.getAllBookLoans).toHaveBeenCalled();
        expect(component.totalLoans).toBe(2);
        expect(component.activeLoans).toBe(1);
        expect(component.loading).toBeFalsy();
        done();
      }, 100);
    });

    it('should load recent loans (last 5)', (done) => {
      component.loadDashboardData();

      setTimeout(() => {
        expect(component.recentLoans.length).toBeLessThanOrEqual(5);
        expect(component.recentLoans[0].loanDate).toBe('2024-01-05'); // Most recent
        done();
      }, 100);
    });

    it('should load overdue loans', (done) => {
      component.loadDashboardData();

      setTimeout(() => {
        expect(loanServiceSpy.getOverdueLoans).toHaveBeenCalled();
        expect(component.overdueLoans).toEqual(mockOverdueLoans);
        done();
      }, 100);
    });

    it('should handle error when loading books', (done) => {
      bookServiceSpy.getAllBooks.and.returnValue(throwError(() => new Error('Error loading books')));
      spyOn(console, 'error');

      component.loadDashboardData();

      setTimeout(() => {
        expect(console.error).toHaveBeenCalledWith('Error loading books:', jasmine.any(Error));
        done();
      }, 100);
    });

    it('should handle error when loading persons', (done) => {
      personServiceSpy.getAllPersons.and.returnValue(throwError(() => new Error('Error loading persons')));
      spyOn(console, 'error');

      component.loadDashboardData();

      setTimeout(() => {
        expect(console.error).toHaveBeenCalledWith('Error loading persons:', jasmine.any(Error));
        done();
      }, 100);
    });

    it('should handle error when loading loans and set loading to false', (done) => {
      loanServiceSpy.getAllBookLoans.and.returnValue(throwError(() => new Error('Error loading loans')));
      spyOn(console, 'error');

      component.loadDashboardData();

      setTimeout(() => {
        expect(console.error).toHaveBeenCalledWith('Error loading loans:', jasmine.any(Error));
        expect(component.loading).toBeFalsy();
        done();
      }, 100);
    });

    it('should handle error when loading overdue loans', (done) => {
      loanServiceSpy.getOverdueLoans.and.returnValue(throwError(() => new Error('Error loading overdue')));
      spyOn(console, 'error');

      component.loadDashboardData();

      setTimeout(() => {
        expect(console.error).toHaveBeenCalledWith('Error loading overdue loans:', jasmine.any(Error));
        done();
      }, 100);
    });
  });

  describe('formatDate', () => {
    it('should format date string to local date', () => {
      const dateString = '2024-01-15';
      const formattedDate = component.formatDate(dateString);
      const expectedDate = new Date(dateString).toLocaleDateString();
      expect(formattedDate).toBe(expectedDate);
    });

    it('should handle different date formats', () => {
      const dateString = '2024-01-01T10:30:00Z';
      const formattedDate = component.formatDate(dateString);
      expect(formattedDate).toBeTruthy();
      expect(typeof formattedDate).toBe('string');
    });
  });

  describe('getStatusBadgeClass', () => {
    it('should return bg-danger for overdue loans', () => {
      const overdueLoan = { ...mockLoans[0], isOverdue: true };
      expect(component.getStatusBadgeClass(overdueLoan)).toBe('bg-danger');
    });

    it('should return bg-success for returned loans', () => {
      const returnedLoan = { ...mockLoans[0], isReturned: true, isOverdue: false };
      expect(component.getStatusBadgeClass(returnedLoan)).toBe('bg-success');
    });

    it('should return bg-warning for active loans', () => {
      const activeLoan = { ...mockLoans[0], isReturned: false, isOverdue: false };
      expect(component.getStatusBadgeClass(activeLoan)).toBe('bg-warning');
    });

    it('should prioritize overdue over returned', () => {
      const loan = { ...mockLoans[0], isOverdue: true, isReturned: true };
      expect(component.getStatusBadgeClass(loan)).toBe('bg-danger');
    });
  });

  describe('getStatusText', () => {
    it('should return OVERDUE for overdue loans', () => {
      const overdueLoan = { ...mockLoans[0], isOverdue: true };
      expect(component.getStatusText(overdueLoan)).toBe('OVERDUE');
    });

    it('should return RETURNED for returned loans', () => {
      const returnedLoan = { ...mockLoans[0], isReturned: true, isOverdue: false };
      expect(component.getStatusText(returnedLoan)).toBe('RETURNED');
    });

    it('should return ACTIVE for active loans', () => {
      const activeLoan = { ...mockLoans[0], isReturned: false, isOverdue: false };
      expect(component.getStatusText(activeLoan)).toBe('ACTIVE');
    });

    it('should prioritize overdue status', () => {
      const loan = { ...mockLoans[0], isOverdue: true, isReturned: true };
      expect(component.getStatusText(loan)).toBe('OVERDUE');
    });
  });

  describe('component initialization', () => {
    it('should initialize with default values', () => {
      expect(component.totalBooks).toBe(0);
      expect(component.totalPersons).toBe(0);
      expect(component.totalLoans).toBe(0);
      expect(component.activeLoans).toBe(0);
      expect(component.overdueLoans).toEqual([]);
      expect(component.recentLoans).toEqual([]);
      expect(component.loading).toBeFalsy();
    });
  });
});


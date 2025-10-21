import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../pipes/filter.pipe';
import { BookLoanService } from '../../services/book-loan.service';
import { BookService } from '../../services/book.service';
import { PersonService } from '../../services/person.service';
import { BookLoan, Book, Person } from '../../models';

@Component({
  selector: 'app-book-loans',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe],
  templateUrl: './book-loans.component.html',
  styleUrl: './book-loans.component.css'
})
export class BookLoansComponent implements OnInit {
  loans: BookLoan[] = [];
  filteredLoans: BookLoan[] = [];
  books: Book[] = [];
  persons: Person[] = [];

  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  filterStatus: 'all' | 'active' | 'returned' | 'overdue' = 'all';
  searchTerm: string = '';
  showLoanModal: boolean = false;
  showReturnModal: boolean = false;
  currentLoan: any = this.getEmptyLoan();
  selectedLoanForReturn?: BookLoan;
  returnDate: string = '';

  constructor(
    private loanService: BookLoanService,
    private bookService: BookService,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.loadLoans();
    this.loadBooksAndPersons();
  }

  loadLoans(): void {
    this.loading = true;
    this.error = '';
    this.loanService.getAllBookLoans().subscribe({
      next: (loans) => {
        this.loans = loans;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load loans. Please try again.';
        this.loading = false;
        console.error('Error loading loans:', error);
      }
    });
  }

  loadBooksAndPersons(): void {
    this.bookService.getAllBooks().subscribe({
      next: (books) => this.books = books,
      error: (error) => console.error('Error loading books:', error)
    });

    this.personService.getAllPersons().subscribe({
      next: (persons) => this.persons = persons,
      error: (error) => console.error('Error loading persons:', error)
    });
  }

  applyFilters(): void {
    let filtered = [...this.loans];

    // Apply status filter
    switch (this.filterStatus) {
      case 'active':
        filtered = filtered.filter(loan => !loan.isReturned);
        break;
      case 'returned':
        filtered = filtered.filter(loan => loan.isReturned);
        break;
      case 'overdue':
        filtered = filtered.filter(loan => loan.isOverdue);
        break;
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(loan =>
        loan.book?.bookName.toLowerCase().includes(term) ||
        loan.person?.name.toLowerCase().includes(term) ||
        loan.person?.lastName.toLowerCase().includes(term)
      );
    }

    this.filteredLoans = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  openLoanModal(): void {
    this.currentLoan = this.getEmptyLoan();
    this.showLoanModal = true;
  }

  closeLoanModal(): void {
    this.showLoanModal = false;
    this.currentLoan = this.getEmptyLoan();
    this.error = '';
  }

  createLoan(): void {
    this.error = '';

    if (!this.currentLoan.personId || !this.currentLoan.bookId) {
      this.error = 'Please select both a person and a book';
      return;
    }

    if (!this.currentLoan.loanDate || !this.currentLoan.dueDate) {
      this.error = 'Please provide loan and due dates';
      return;
    }

    this.loading = true;

    const loanRequest = {
      personId: parseInt(this.currentLoan.personId),
      bookId: parseInt(this.currentLoan.bookId),
      loanDate: new Date(this.currentLoan.loanDate).toISOString(),
      dueDate: new Date(this.currentLoan.dueDate).toISOString()
    };

    this.loanService.createBookLoan(loanRequest).subscribe({
      next: (loan) => {
        this.loadLoans();
        this.showSuccessMessage('Book loan created successfully!');
        this.closeLoanModal();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to create loan. The book might already be loaned out.';
        this.loading = false;
        console.error('Error creating loan:', error);
      }
    });
  }

  openReturnModal(loan: BookLoan): void {
    this.selectedLoanForReturn = loan;
    this.returnDate = new Date().toISOString().split('T')[0];
    this.showReturnModal = true;
  }

  closeReturnModal(): void {
    this.showReturnModal = false;
    this.selectedLoanForReturn = undefined;
    this.returnDate = '';
    this.error = '';
  }

  returnBook(): void {
    if (!this.selectedLoanForReturn) return;

    this.loading = true;
    const returnDateISO = new Date(this.returnDate).toISOString();

    this.loanService.returnBook(this.selectedLoanForReturn.bookLoanId, returnDateISO).subscribe({
      next: (response) => {
        this.loadLoans();
        this.showSuccessMessage(`Book returned successfully!`);
        this.closeReturnModal();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to return book. Please try again.';
        this.loading = false;
        console.error('Error returning book:', error);
      }
    });
  }

  deleteLoan(loan: BookLoan): void {
    if (!confirm(`Are you sure you want to delete this loan record?`)) {
      return;
    }

    this.loading = true;
    this.loanService.deleteBookLoan(loan.bookLoanId).subscribe({
      next: () => {
        this.loadLoans();
        this.showSuccessMessage('Loan record deleted successfully!');
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to delete loan. Please try again.';
        this.loading = false;
        console.error('Error deleting loan:', error);
      }
    });
  }

  getStatusBadgeClass(loan: BookLoan): string {
    if (loan.isOverdue) return 'bg-danger';
    if (loan.isReturned) return 'bg-success';
    return 'bg-warning';
  }

  getStatusText(loan: BookLoan): string {
    if (loan.isOverdue) return 'OVERDUE';
    if (loan.isReturned) return 'RETURNED';
    return 'ACTIVE';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  getEmptyLoan(): any {
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks default

    return {
      personId: '',
      bookId: '',
      loanDate: today,
      dueDate: dueDate.toISOString().split('T')[0]
    };
  }
}

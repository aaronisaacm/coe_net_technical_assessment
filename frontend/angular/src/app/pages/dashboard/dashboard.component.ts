import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { PersonService } from '../../services/person.service';
import { BookLoanService } from '../../services/book-loan.service';
import { Book, Person, BookLoan } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalBooks: number = 0;
  totalPersons: number = 0;
  totalLoans: number = 0;
  activeLoans: number = 0;
  overdueLoans: BookLoan[] = [];
  recentLoans: BookLoan[] = [];
  loading: boolean = false;

  constructor(
    private bookService: BookService,
    private personService: PersonService,
    private loanService: BookLoanService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    // Load Books
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.totalBooks = books.length;
      },
      error: (error) => console.error('Error loading books:', error)
    });

    // Load Persons
    this.personService.getAllPersons().subscribe({
      next: (persons) => {
        this.totalPersons = persons.length;
      },
      error: (error) => console.error('Error loading persons:', error)
    });

    // Load All Loans
    this.loanService.getAllBookLoans().subscribe({
      next: (loans) => {
        this.totalLoans = loans.length;
        this.activeLoans = loans.filter(l => !l.isReturned).length;

        // Get recent loans (last 5)
        this.recentLoans = loans
          .sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime())
          .slice(0, 5);

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading loans:', error);
        this.loading = false;
      }
    });

    // Load Overdue Loans
    this.loanService.getOverdueLoans().subscribe({
      next: (loans) => {
        this.overdueLoans = loans;
      },
      error: (error) => console.error('Error loading overdue loans:', error)
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
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
}

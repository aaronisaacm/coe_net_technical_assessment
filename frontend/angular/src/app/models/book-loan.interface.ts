import { Person } from './person.interface';
import { Book } from './book.interface';

export interface BookLoan {
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


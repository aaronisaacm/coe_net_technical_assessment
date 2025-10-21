export interface BookAvailabilityResponse {
  bookId: number;
  isAvailable: boolean;
}

export interface LoanReturnStatusResponse {
  loanId: number;
  isReturned: boolean;
}

export interface BookReturnResponse {
  message: string;
  loanId: number;
  returnDate: string;
}

export interface CreateBookLoanRequest {
  personId: number;
  bookId: number;
  loanDate: string;
  dueDate: string;
}

export interface UpdateBookLoanRequest {
  bookLoanId: number;
  personId: number;
  bookId: number;
  loanDate: string;
  returnDate: string | null;
  dueDate: string;
  isReturned: boolean;
}


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BookLoan } from '../models';
import { BookAvailabilityResponse, LoanReturnStatusResponse, BookReturnResponse, CreateBookLoanRequest, UpdateBookLoanRequest } from '../models/bookResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class BookLoanService {
  private apiUrl = `${environment.apiBaseUrl}/BookLoan`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const credentials = btoa(`${environment.auth.username}:${environment.auth.password}`);
    return new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    });
  }

  getAllBookLoans(): Observable<BookLoan[]> {
    return this.http.get<BookLoan[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getBookLoanById(id: number): Observable<BookLoan> {
    return this.http.get<BookLoan>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getActiveLoansbyPerson(personId: number): Observable<BookLoan[]> {
    return this.http.get<BookLoan[]>(`${this.apiUrl}/person/${personId}/active`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getLoanHistoryByPerson(personId: number): Observable<BookLoan[]> {
    return this.http.get<BookLoan[]>(`${this.apiUrl}/person/${personId}/history`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getActiveLoansbyBook(bookId: number): Observable<BookLoan[]> {
    return this.http.get<BookLoan[]>(`${this.apiUrl}/book/${bookId}/active`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  checkBookAvailability(bookId: number): Observable<BookAvailabilityResponse> {
    return this.http.get<BookAvailabilityResponse>(`${this.apiUrl}/book/${bookId}/available`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getOverdueLoans(): Observable<BookLoan[]> {
    return this.http.get<BookLoan[]>(`${this.apiUrl}/overdue`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getReturnedLoans(): Observable<BookLoan[]> {
    return this.http.get<BookLoan[]>(`${this.apiUrl}/returned`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  checkLoanReturnStatus(id: number): Observable<LoanReturnStatusResponse> {
    return this.http.get<LoanReturnStatusResponse>(`${this.apiUrl}/${id}/returned`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createBookLoan(loan: CreateBookLoanRequest): Observable<BookLoan> {
    return this.http.post<BookLoan>(this.apiUrl, loan, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateBookLoan(id: number, loan: UpdateBookLoanRequest): Observable<BookLoan> {
    return this.http.put<BookLoan>(`${this.apiUrl}/${id}`, loan, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  returnBook(id: number, returnDate?: string): Observable<BookReturnResponse> {
    const body = returnDate || null;
    return this.http.put<BookReturnResponse>(`${this.apiUrl}/${id}/return`, JSON.stringify(body), {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteBookLoan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error) {
        errorMessage += `\nDetails: ${JSON.stringify(error.error)}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}


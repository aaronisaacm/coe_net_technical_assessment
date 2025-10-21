import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Person } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = `${environment.apiBaseUrl}/Person`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const credentials = btoa(`${environment.auth.username}:${environment.auth.password}`);
    return new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    });
  }

  getAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  searchPersons(searchTerm: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/search/${encodeURIComponent(searchTerm)}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getPersonByName(name: string, lastName: string): Observable<Person> {
    const params = new HttpParams()
      .set('name', name)
      .set('lastName', lastName);

    return this.http.get<Person>(`${this.apiUrl}/byname`, { params, headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createPerson(person: Omit<Person, 'personId'>): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updatePerson(id: number, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${id}`, person, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error) {
        errorMessage += `\nDetails: ${JSON.stringify(error.error)}`;
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}


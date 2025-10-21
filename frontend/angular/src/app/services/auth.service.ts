import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {}

  private hasToken(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  login(username: string, password: string): boolean {
    if (username === environment.auth.username && password === environment.auth.password) {
      const token = btoa(`${username}:${password}`);
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);
      this.isAuthenticatedSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}

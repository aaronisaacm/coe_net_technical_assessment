import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AboutComponent } from './pages/about/about.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BooksComponent } from './pages/books/books.component';
import { PersonsComponent } from './pages/persons/persons.component';
import { BookLoansComponent } from './pages/book-loans/book-loans.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'books', component: BooksComponent, canActivate: [authGuard] },
    { path: 'persons', component: PersonsComponent, canActivate: [authGuard] },
    { path: 'book-loans', component: BookLoansComponent, canActivate: [authGuard] },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'about', component: AboutComponent, canActivate: [authGuard] },
    { path: '**', component: PageNotFoundComponent }
];

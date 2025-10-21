import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book } from '../../models';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  // Modal state
  showModal: boolean = false;
  isEditMode: boolean = false;
  currentBook: Book = this.getEmptyBook();

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.error = '';
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.filteredBooks = books;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load books. Please try again.';
        this.loading = false;
        console.error('Error loading books:', error);
      }
    });
  }

  searchBooks(): void {
    if (!this.searchTerm.trim()) {
      this.filteredBooks = this.books;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredBooks = this.books.filter(book =>
      book.bookName.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.description.toLowerCase().includes(term)
    );
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentBook = this.getEmptyBook();
    this.showModal = true;
  }

  openEditModal(book: Book): void {
    this.isEditMode = true;
    this.currentBook = { ...book };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentBook = this.getEmptyBook();
    this.error = '';
  }

  saveBook(): void {
    this.error = '';

    if (!this.validateBook()) {
      return;
    }

    if (this.isEditMode) {
      this.updateBook();
    } else {
      this.createBook();
    }
  }

  validateBook(): boolean {
    if (!this.currentBook.bookName?.trim()) {
      this.error = 'Book name is required';
      return false;
    }
    if (!this.currentBook.author?.trim()) {
      this.error = 'Author is required';
      return false;
    }
    if (!this.currentBook.description?.trim()) {
      this.error = 'Description is required';
      return false;
    }
    return true;
  }

  createBook(): void {
    this.loading = true;
    const { bookId, ...bookData } = this.currentBook;

    this.bookService.createBook(bookData).subscribe({
      next: (book) => {
        this.books.push(book);
        this.filteredBooks = this.books;
        this.showSuccessMessage('Book created successfully!');
        this.closeModal();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to create book. Please try again.';
        this.loading = false;
        console.error('Error creating book:', error);
      }
    });
  }

  updateBook(): void {
    this.loading = true;

    this.bookService.updateBook(this.currentBook.bookId, this.currentBook).subscribe({
      next: (updatedBook) => {
        const index = this.books.findIndex(b => b.bookId === updatedBook.bookId);
        if (index !== -1) {
          this.books[index] = updatedBook;
          this.filteredBooks = this.books;
        }
        this.showSuccessMessage('Book updated successfully!');
        this.closeModal();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to update book. Please try again.';
        this.loading = false;
        console.error('Error updating book:', error);
      }
    });
  }

  deleteBook(book: Book): void {
    if (!confirm(`Are you sure you want to delete "${book.bookName}"?`)) {
      return;
    }

    this.loading = true;
    this.bookService.deleteBook(book.bookId).subscribe({
      next: () => {
        this.books = this.books.filter(b => b.bookId !== book.bookId);
        this.filteredBooks = this.books;
        this.showSuccessMessage('Book deleted successfully!');
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to delete book. Please try again.';
        this.loading = false;
        console.error('Error deleting book:', error);
      }
    });
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  getEmptyBook(): Book {
    return {
      bookId: 0,
      bookName: '',
      author: '',
      description: ''
    };
  }
}

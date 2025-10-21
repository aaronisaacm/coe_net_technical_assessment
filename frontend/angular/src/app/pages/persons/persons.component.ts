import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models';

@Component({
  selector: 'app-persons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.css'
})
export class PersonsComponent implements OnInit {
  persons: Person[] = [];
  filteredPersons: Person[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  // Modal state
  showModal: boolean = false;
  isEditMode: boolean = false;
  currentPerson: Person = this.getEmptyPerson();

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.loading = true;
    this.error = '';
    this.personService.getAllPersons().subscribe({
      next: (persons) => {
        this.persons = persons;
        this.filteredPersons = persons;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load persons. Please try again.';
        this.loading = false;
        console.error('Error loading persons:', error);
      }
    });
  }

  searchPersons(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPersons = this.persons;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredPersons = this.persons.filter(person =>
      person.name.toLowerCase().includes(term) ||
      person.lastName.toLowerCase().includes(term)
    );
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentPerson = this.getEmptyPerson();
    this.showModal = true;
  }

  openEditModal(person: Person): void {
    this.isEditMode = true;
    this.currentPerson = { ...person };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentPerson = this.getEmptyPerson();
    this.error = '';
  }

  savePerson(): void {
    this.error = '';

    if (!this.validatePerson()) {
      return;
    }

    if (this.isEditMode) {
      this.updatePerson();
    } else {
      this.createPerson();
    }
  }

  validatePerson(): boolean {
    if (!this.currentPerson.name?.trim()) {
      this.error = 'First name is required';
      return false;
    }
    if (!this.currentPerson.lastName?.trim()) {
      this.error = 'Last name is required';
      return false;
    }
    return true;
  }

  createPerson(): void {
    this.loading = true;
    const { personId, ...personData } = this.currentPerson;

    this.personService.createPerson(personData).subscribe({
      next: (person) => {
        this.persons.push(person);
        this.filteredPersons = this.persons;
        this.showSuccessMessage('Person created successfully!');
        this.closeModal();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to create person. Please try again.';
        this.loading = false;
        console.error('Error creating person:', error);
      }
    });
  }

  updatePerson(): void {
    this.loading = true;

    this.personService.updatePerson(this.currentPerson.personId, this.currentPerson).subscribe({
      next: (updatedPerson) => {
        const index = this.persons.findIndex(p => p.personId === updatedPerson.personId);
        if (index !== -1) {
          this.persons[index] = updatedPerson;
          this.filteredPersons = this.persons;
        }
        this.showSuccessMessage('Person updated successfully!');
        this.closeModal();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to update person. Please try again.';
        this.loading = false;
        console.error('Error updating person:', error);
      }
    });
  }

  deletePerson(person: Person): void {
    if (!confirm(`Are you sure you want to delete "${person.name} ${person.lastName}"?`)) {
      return;
    }

    this.loading = true;
    this.personService.deletePerson(person.personId).subscribe({
      next: () => {
        this.persons = this.persons.filter(p => p.personId !== person.personId);
        this.filteredPersons = this.persons;
        this.showSuccessMessage('Person deleted successfully!');
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to delete person. Please try again.';
        this.loading = false;
        console.error('Error deleting person:', error);
      }
    });
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  getEmptyPerson(): Person {
    return {
      personId: 0,
      name: '',
      lastName: ''
    };
  }
}

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PersonsComponent } from './persons.component';
import { PersonService } from '../../services/person.service';
import { of, throwError } from 'rxjs';
import { Person } from '../../models';

describe('PersonsComponent', () => {
  let component: PersonsComponent;
  let fixture: ComponentFixture<PersonsComponent>;
  let personServiceSpy: jasmine.SpyObj<PersonService>;

  const mockPersons: Person[] = [
    { personId: 1, name: 'John', lastName: 'Doe' },
    { personId: 2, name: 'Jane', lastName: 'Smith' },
    { personId: 3, name: 'Bob', lastName: 'Johnson' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PersonService', ['getAllPersons', 'createPerson', 'updatePerson', 'deletePerson']);

    await TestBed.configureTestingModule({
      imports: [PersonsComponent],
      providers: [{ provide: PersonService, useValue: spy }]
    }).compileComponents();

    personServiceSpy = TestBed.inject(PersonService) as jasmine.SpyObj<PersonService>;
    fixture = TestBed.createComponent(PersonsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadPersons', () => {
      spyOn(component, 'loadPersons');
      component.ngOnInit();
      expect(component.loadPersons).toHaveBeenCalled();
    });
  });

  describe('loadPersons', () => {
    it('should load persons successfully', () => {
      personServiceSpy.getAllPersons.and.returnValue(of(mockPersons));

      component.loadPersons();

      expect(personServiceSpy.getAllPersons).toHaveBeenCalled();
      expect(component.persons).toEqual(mockPersons);
      expect(component.filteredPersons).toEqual(mockPersons);
      expect(component.loading).toBeFalsy();
      expect(component.error).toBe('');
    });

    it('should set loading to false after successful load', () => {
      personServiceSpy.getAllPersons.and.returnValue(of(mockPersons));
      component.loadPersons();
      expect(component.loading).toBeFalsy();
    });

    it('should handle error when loading persons fails', () => {
      personServiceSpy.getAllPersons.and.returnValue(throwError(() => new Error('Load error')));
      spyOn(console, 'error');

      component.loadPersons();

      expect(component.error).toBe('Failed to load persons. Please try again.');
      expect(component.loading).toBeFalsy();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('searchPersons', () => {
    beforeEach(() => {
      component.persons = mockPersons;
      component.filteredPersons = mockPersons;
    });

    it('should show all persons when search term is empty', () => {
      component.searchTerm = '';
      component.searchPersons();
      expect(component.filteredPersons).toEqual(mockPersons);
    });

    it('should filter persons by first name', () => {
      component.searchTerm = 'Jane';
      component.searchPersons();
      expect(component.filteredPersons.length).toBe(1);
      expect(component.filteredPersons[0].name).toBe('Jane');
    });

    it('should filter persons by last name (case insensitive)', () => {
      component.searchTerm = 'smith';
      component.searchPersons();
      expect(component.filteredPersons.length).toBe(1);
      expect(component.filteredPersons[0].lastName).toBe('Smith');
    });

    it('should return empty array when no matches found', () => {
      component.searchTerm = 'NonExistent';
      component.searchPersons();
      expect(component.filteredPersons.length).toBe(0);
    });

    it('should handle whitespace in search term', () => {
      component.searchTerm = '   ';
      component.searchPersons();
      expect(component.filteredPersons).toEqual(mockPersons);
    });

    it('should filter by partial name match', () => {
      component.searchTerm = 'Jo';
      component.searchPersons();
      expect(component.filteredPersons.length).toBe(2); // John and Johnson
    });
  });

  describe('Modal Management', () => {
    describe('openAddModal', () => {
      it('should open modal in add mode', () => {
        component.openAddModal();
        expect(component.showModal).toBeTruthy();
        expect(component.isEditMode).toBeFalsy();
        expect(component.currentPerson).toEqual(component.getEmptyPerson());
      });
    });

    describe('openEditModal', () => {
      it('should open modal in edit mode with person data', () => {
        const person = mockPersons[0];
        component.openEditModal(person);
        expect(component.showModal).toBeTruthy();
        expect(component.isEditMode).toBeTruthy();
        expect(component.currentPerson).toEqual(person);
      });

      it('should create a copy of the person object', () => {
        const person = mockPersons[0];
        component.openEditModal(person);
        expect(component.currentPerson).not.toBe(person);
        expect(component.currentPerson).toEqual(person);
      });
    });

    describe('closeModal', () => {
      it('should close modal and reset state', () => {
        component.showModal = true;
        component.currentPerson = mockPersons[0];
        component.error = 'Some error';

        component.closeModal();

        expect(component.showModal).toBeFalsy();
        expect(component.currentPerson).toEqual(component.getEmptyPerson());
        expect(component.error).toBe('');
      });
    });
  });

  describe('validatePerson', () => {
    beforeEach(() => {
      component.currentPerson = component.getEmptyPerson();
    });

    it('should return true for valid person', () => {
      component.currentPerson = {
        personId: 0,
        name: 'Valid Name',
        lastName: 'Valid LastName'
      };
      expect(component.validatePerson()).toBeTruthy();
      expect(component.error).toBe('');
    });

    it('should return false and set error when first name is empty', () => {
      component.currentPerson.name = '';
      component.currentPerson.lastName = 'Doe';
      expect(component.validatePerson()).toBeFalsy();
      expect(component.error).toBe('First name is required');
    });

    it('should return false when first name is only whitespace', () => {
      component.currentPerson.name = '   ';
      component.currentPerson.lastName = 'Doe';
      expect(component.validatePerson()).toBeFalsy();
      expect(component.error).toBe('First name is required');
    });

    it('should return false and set error when last name is empty', () => {
      component.currentPerson.name = 'John';
      component.currentPerson.lastName = '';
      expect(component.validatePerson()).toBeFalsy();
      expect(component.error).toBe('Last name is required');
    });

    it('should return false when last name is only whitespace', () => {
      component.currentPerson.name = 'John';
      component.currentPerson.lastName = '   ';
      expect(component.validatePerson()).toBeFalsy();
      expect(component.error).toBe('Last name is required');
    });
  });

  describe('savePerson', () => {
    beforeEach(() => {
      component.currentPerson = {
        personId: 0,
        name: 'Test Name',
        lastName: 'Test LastName'
      };
    });

    it('should call createPerson when in add mode', () => {
      component.isEditMode = false;
      spyOn(component, 'createPerson');
      component.savePerson();
      expect(component.createPerson).toHaveBeenCalled();
    });

    it('should call updatePerson when in edit mode', () => {
      component.isEditMode = true;
      spyOn(component, 'updatePerson');
      component.savePerson();
      expect(component.updatePerson).toHaveBeenCalled();
    });

    it('should not save if validation fails', () => {
      component.currentPerson.name = '';
      spyOn(component, 'createPerson');
      spyOn(component, 'updatePerson');

      component.savePerson();

      expect(component.createPerson).not.toHaveBeenCalled();
      expect(component.updatePerson).not.toHaveBeenCalled();
    });
  });

  describe('createPerson', () => {
    beforeEach(() => {
      component.persons = [...mockPersons];
      component.currentPerson = {
        personId: 0,
        name: 'New Name',
        lastName: 'New LastName'
      };
    });

    it('should create person successfully', () => {
      const newPerson: Person = { ...component.currentPerson, personId: 4 };
      personServiceSpy.createPerson.and.returnValue(of(newPerson));
      spyOn(component, 'closeModal');
      spyOn(component, 'showSuccessMessage');

      component.createPerson();

      expect(personServiceSpy.createPerson).toHaveBeenCalled();
      expect(component.persons.length).toBe(4);
      expect(component.showSuccessMessage).toHaveBeenCalledWith('Person created successfully!');
      expect(component.closeModal).toHaveBeenCalled();
      expect(component.loading).toBeFalsy();
    });

    it('should exclude personId from request', () => {
      const newPerson: Person = { personId: 4, name: 'New Name', lastName: 'New LastName' };
      personServiceSpy.createPerson.and.returnValue(of(newPerson));

      component.createPerson();

      const callArgs = personServiceSpy.createPerson.calls.mostRecent().args[0];
      expect('personId' in callArgs).toBeFalsy();
    });

    it('should handle error when creating person fails', () => {
      personServiceSpy.createPerson.and.returnValue(throwError(() => new Error('Create error')));
      spyOn(console, 'error');

      component.createPerson();

      expect(component.error).toBe('Failed to create person. Please try again.');
      expect(component.loading).toBeFalsy();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updatePerson', () => {
    beforeEach(() => {
      component.persons = [...mockPersons];
      component.currentPerson = { ...mockPersons[0], name: 'Updated Name' };
    });

    it('should update person successfully', () => {
      personServiceSpy.updatePerson.and.returnValue(of(component.currentPerson));
      spyOn(component, 'closeModal');
      spyOn(component, 'showSuccessMessage');

      component.updatePerson();

      expect(personServiceSpy.updatePerson).toHaveBeenCalledWith(component.currentPerson.personId, component.currentPerson);
      expect(component.persons[0]).toEqual(component.currentPerson);
      expect(component.showSuccessMessage).toHaveBeenCalledWith('Person updated successfully!');
      expect(component.closeModal).toHaveBeenCalled();
      expect(component.loading).toBeFalsy();
    });

    it('should handle error when updating person fails', () => {
      personServiceSpy.updatePerson.and.returnValue(throwError(() => new Error('Update error')));
      spyOn(console, 'error');

      component.updatePerson();

      expect(component.error).toBe('Failed to update person. Please try again.');
      expect(component.loading).toBeFalsy();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deletePerson', () => {
    beforeEach(() => {
      component.persons = [...mockPersons];
      component.filteredPersons = [...mockPersons];
    });

    it('should delete person after confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      personServiceSpy.deletePerson.and.returnValue(of(undefined as void));
      spyOn(component, 'showSuccessMessage');

      component.deletePerson(mockPersons[0]);

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "John Doe"?');
      expect(personServiceSpy.deletePerson).toHaveBeenCalledWith(mockPersons[0].personId);
      expect(component.persons.length).toBe(2);
      expect(component.showSuccessMessage).toHaveBeenCalledWith('Person deleted successfully!');
      expect(component.loading).toBeFalsy();
    });

    it('should not delete person if confirmation is cancelled', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deletePerson(mockPersons[0]);

      expect(personServiceSpy.deletePerson).not.toHaveBeenCalled();
      expect(component.persons.length).toBe(3);
    });

    it('should handle error when deleting person fails', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      personServiceSpy.deletePerson.and.returnValue(throwError(() => new Error('Delete error')));
      spyOn(console, 'error');

      component.deletePerson(mockPersons[0]);

      expect(component.error).toBe('Failed to delete person. Please try again.');
      expect(component.loading).toBeFalsy();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('showSuccessMessage', () => {
    it('should set success message', () => {
      component.showSuccessMessage('Test message');
      expect(component.successMessage).toBe('Test message');
    });

    it('should clear success message after 3 seconds', fakeAsync(() => {
      component.showSuccessMessage('Test message');
      expect(component.successMessage).toBe('Test message');

      tick(3000);

      expect(component.successMessage).toBe('');
    }));
  });

  describe('getEmptyPerson', () => {
    it('should return empty person object', () => {
      const emptyPerson = component.getEmptyPerson();
      expect(emptyPerson).toEqual({
        personId: 0,
        name: '',
        lastName: ''
      });
    });
  });

  describe('component initialization', () => {
    it('should initialize with default values', () => {
      expect(component.persons).toEqual([]);
      expect(component.filteredPersons).toEqual([]);
      expect(component.searchTerm).toBe('');
      expect(component.loading).toBeFalsy();
      expect(component.error).toBe('');
      expect(component.successMessage).toBe('');
      expect(component.showModal).toBeFalsy();
      expect(component.isEditMode).toBeFalsy();
    });
  });
});


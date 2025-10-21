import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PersonService } from './person.service';
import { Person } from '../models';
import { environment } from '../../environments/environment';

describe('PersonService', () => {
  let service: PersonService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/Person`;

  const mockPerson: Person = {
    personId: 1,
    name: 'John',
    lastName: 'Doe'
  };

  const mockPersons: Person[] = [
    mockPerson,
    {
      personId: 2,
      name: 'Jane',
      lastName: 'Smith'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PersonService]
    });
    service = TestBed.inject(PersonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPersons', () => {
    it('should return an array of persons', () => {
      service.getAllPersons().subscribe(persons => {
        expect(persons).toEqual(mockPersons);
        expect(persons.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockPersons);
    });

    it('should handle error when fetching all persons', () => {
      service.getAllPersons().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 500');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getPersonById', () => {
    it('should return a single person', () => {
      const personId = 1;

      service.getPersonById(personId).subscribe(person => {
        expect(person).toEqual(mockPerson);
      });

      const req = httpMock.expectOne(`${apiUrl}/${personId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush(mockPerson);
    });

    it('should handle 404 error when person not found', () => {
      const personId = 999;

      service.getPersonById(personId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${personId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('searchPersons', () => {
    it('should return persons matching search term', () => {
      const searchTerm = 'John';

      service.searchPersons(searchTerm).subscribe(persons => {
        expect(persons).toEqual([mockPerson]);
        expect(persons.length).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/search/${encodeURIComponent(searchTerm)}`);
      expect(req.request.method).toBe('GET');
      req.flush([mockPerson]);
    });

    it('should return empty array when no matches found', () => {
      const searchTerm = 'NonExistent';

      service.searchPersons(searchTerm).subscribe(persons => {
        expect(persons).toEqual([]);
        expect(persons.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/search/${encodeURIComponent(searchTerm)}`);
      req.flush([]);
    });

    it('should encode special characters in search term', () => {
      const searchTerm = 'O\'Brien';

      service.searchPersons(searchTerm).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/search/${encodeURIComponent(searchTerm)}`);
      expect(req.request.urlWithParams).toContain(encodeURIComponent(searchTerm));
      req.flush([]);
    });
  });

  describe('getPersonByName', () => {
    it('should return a person by full name', () => {
      const name = 'John';
      const lastName = 'Doe';

      service.getPersonByName(name, lastName).subscribe(person => {
        expect(person).toEqual(mockPerson);
      });

      const req = httpMock.expectOne(req =>
        req.url === `${apiUrl}/byname` &&
        req.params.get('name') === name &&
        req.params.get('lastName') === lastName
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('name')).toBe(name);
      expect(req.request.params.get('lastName')).toBe(lastName);
      req.flush(mockPerson);
    });

    it('should handle person not found by name', () => {
      const name = 'NonExistent';
      const lastName = 'Person';

      service.getPersonByName(name, lastName).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(req =>
        req.url === `${apiUrl}/byname`
      );
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createPerson', () => {
    it('should create a new person', () => {
      const newPerson: Omit<Person, 'personId'> = {
        name: 'Alice',
        lastName: 'Johnson'
      };

      service.createPerson(newPerson).subscribe(person => {
        expect(person.personId).toBeDefined();
        expect(person.name).toBe(newPerson.name);
        expect(person.lastName).toBe(newPerson.lastName);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPerson);
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush({ ...newPerson, personId: 3 });
    });

    it('should handle validation error when creating person', () => {
      const invalidPerson: Omit<Person, 'personId'> = {
        name: '',
        lastName: ''
      };

      service.createPerson(invalidPerson).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 400');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Validation error', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle duplicate person error', () => {
      const duplicatePerson: Omit<Person, 'personId'> = {
        name: 'John',
        lastName: 'Doe'
      };

      service.createPerson(duplicatePerson).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 409');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Person already exists', { status: 409, statusText: 'Conflict' });
    });
  });

  describe('updatePerson', () => {
    it('should update an existing person', () => {
      const personId = 1;
      const updatedPerson: Person = {
        ...mockPerson,
        name: 'Jonathan'
      };

      service.updatePerson(personId, updatedPerson).subscribe(person => {
        expect(person.name).toBe('Jonathan');
      });

      const req = httpMock.expectOne(`${apiUrl}/${personId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedPerson);
      req.flush(updatedPerson);
    });

    it('should handle error when updating non-existent person', () => {
      const personId = 999;

      service.updatePerson(personId, mockPerson).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${personId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deletePerson', () => {
    it('should delete a person', () => {
      const personId = 1;

      service.deletePerson(personId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${personId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      req.flush(null);
    });

    it('should handle error when deleting person with active loans', () => {
      const personId = 1;

      service.deletePerson(personId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 409');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${personId}`);
      req.flush('Person has active loans', { status: 409, statusText: 'Conflict' });
    });

    it('should handle error when deleting non-existent person', () => {
      const personId = 999;

      service.deletePerson(personId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 404');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${personId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('Authorization Headers', () => {
    it('should include Basic Auth header in all requests', () => {
      service.getAllPersons().subscribe();

      const req = httpMock.expectOne(apiUrl);
      const authHeader = req.request.headers.get('Authorization');
      expect(authHeader).toBeTruthy();
      expect(authHeader).toContain('Basic');
      req.flush([]);
    });

    it('should encode credentials correctly', () => {
      service.getAllPersons().subscribe();

      const req = httpMock.expectOne(apiUrl);
      const authHeader = req.request.headers.get('Authorization');
      const expectedCredentials = btoa(`${environment.auth.username}:${environment.auth.password}`);
      expect(authHeader).toBe(`Basic ${expectedCredentials}`);
      req.flush([]);
    });
  });

  describe('Error Handling', () => {
    it('should handle client-side errors', () => {
      const errorEvent = new ErrorEvent('Network error', {
        message: 'Connection failed'
      });

      service.getAllPersons().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error:');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(errorEvent);
    });

    it('should handle server-side errors with details', () => {
      const errorResponse = { message: 'Internal server error', details: 'Database connection failed' };

      service.getAllPersons().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Error Code: 500');
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(errorResponse, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});


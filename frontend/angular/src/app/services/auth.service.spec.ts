import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    // Create a spy object for localStorage
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem']);

    // Override localStorage with our spy
    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy,
      writable: true
    });

    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorageSpy.getItem.calls.reset();
    localStorageSpy.setItem.calls.reset();
    localStorageSpy.removeItem.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('hasToken', () => {
    it('should return true when authToken exists in localStorage', () => {
      localStorageSpy.getItem.and.returnValue('someToken');
      expect(service.isAuthenticated()).toBeTruthy();
      expect(localStorageSpy.getItem).toHaveBeenCalledWith('authToken');
    });

    it('should return false when authToken does not exist in localStorage', () => {
      localStorageSpy.getItem.and.returnValue(null);
      expect(service.isAuthenticated()).toBeFalsy();
      expect(localStorageSpy.getItem).toHaveBeenCalledWith('authToken');
    });
  });

  describe('login', () => {
    it('should return true and store credentials for valid login', () => {
      const username = environment.auth.username;
      const password = environment.auth.password;
      const expectedToken = btoa(`${username}:${password}`);

      const result = service.login(username, password);

      expect(result).toBeTruthy();
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('authToken', expectedToken);
      expect(localStorageSpy.setItem).toHaveBeenCalledWith('username', username);
    });

    it('should return false for invalid username', () => {
      const result = service.login('wrongUser', environment.auth.password);

      expect(result).toBeFalsy();
      expect(localStorageSpy.setItem).not.toHaveBeenCalled();
    });

    it('should return false for invalid password', () => {
      const result = service.login(environment.auth.username, 'wrongPassword');

      expect(result).toBeFalsy();
      expect(localStorageSpy.setItem).not.toHaveBeenCalled();
    });

    it('should return false for both invalid username and password', () => {
      const result = service.login('wrongUser', 'wrongPassword');

      expect(result).toBeFalsy();
      expect(localStorageSpy.setItem).not.toHaveBeenCalled();
    });

    it('should update isAuthenticated$ observable on successful login', (done) => {
      const username = environment.auth.username;
      const password = environment.auth.password;
      let callCount = 0;

      service.isAuthenticated$.subscribe(isAuth => {
        callCount++;
        // Skip the initial value, wait for the updated value after login
        if (callCount > 1 && isAuth) {
          expect(isAuth).toBeTruthy();
          done();
        }
      });

      service.login(username, password);
    });
  });

  describe('logout', () => {
    it('should remove authToken and username from localStorage', () => {
      service.logout();

      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('authToken');
      expect(localStorageSpy.removeItem).toHaveBeenCalledWith('username');
    });

    it('should update isAuthenticated$ observable to false', (done) => {
      service.isAuthenticated$.subscribe(isAuth => {
        if (!isAuth) {
          expect(isAuth).toBeFalsy();
          done();
        }
      });

      service.logout();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      localStorageSpy.getItem.and.returnValue('someToken');

      expect(service.isAuthenticated()).toBeTruthy();
    });

    it('should return false when user is not authenticated', () => {
      localStorageSpy.getItem.and.returnValue(null);

      expect(service.isAuthenticated()).toBeFalsy();
    });
  });

  describe('getUsername', () => {
    it('should return username from localStorage', () => {
      const expectedUsername = 'testUser';
      localStorageSpy.getItem.and.returnValue(expectedUsername);

      const username = service.getUsername();

      expect(username).toBe(expectedUsername);
      expect(localStorageSpy.getItem).toHaveBeenCalledWith('username');
    });

    it('should return null when no username is stored', () => {
      localStorageSpy.getItem.and.returnValue(null);

      const username = service.getUsername();

      expect(username).toBeNull();
      expect(localStorageSpy.getItem).toHaveBeenCalledWith('username');
    });
  });

  describe('isAuthenticated$ observable', () => {
    it('should emit initial authentication state', (done) => {
      localStorageSpy.getItem.and.returnValue('someToken');

      const newService = new AuthService();

      newService.isAuthenticated$.subscribe(isAuth => {
        expect(isAuth).toBeDefined();
        done();
      });
    });
  });
});


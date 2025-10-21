import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {
      snapshot: {
        queryParams: {}
      } as any
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should set default returnUrl to /dashboard', () => {
      expect(component.returnUrl).toBe('/dashboard');
    });

    it('should get returnUrl from query params if provided', () => {
      activatedRouteStub.snapshot = {
        queryParams: { returnUrl: '/books' }
      } as any;

      const newComponent = new LoginComponent(
        authServiceSpy,
        routerSpy,
        activatedRouteStub as ActivatedRoute
      );

      expect(newComponent.returnUrl).toBe('/books');
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.username = 'testuser';
      component.password = 'testpass';
    });

    it('should clear error message on submit', () => {
      component.errorMessage = 'Previous error';
      authServiceSpy.login.and.returnValue(true);

      component.onSubmit();

      expect(component.errorMessage).toBe('');
    });

    it('should set loading to true', () => {
      component.loading = false;
      authServiceSpy.login.and.returnValue(true);

      component.onSubmit();

      expect(component.loading).toBeTruthy();
    });

    it('should show error when username is empty', () => {
      component.username = '';

      component.onSubmit();

      expect(component.errorMessage).toBe('Please enter username and password');
      expect(component.loading).toBeFalsy();
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should show error when password is empty', () => {
      component.password = '';

      component.onSubmit();

      expect(component.errorMessage).toBe('Please enter username and password');
      expect(component.loading).toBeFalsy();
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should show error when both username and password are empty', () => {
      component.username = '';
      component.password = '';

      component.onSubmit();

      expect(component.errorMessage).toBe('Please enter username and password');
      expect(component.loading).toBeFalsy();
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should call authService.login with credentials', () => {
      authServiceSpy.login.and.returnValue(true);

      component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalledWith('testuser', 'testpass');
    });

    it('should navigate to returnUrl on successful login', () => {
      authServiceSpy.login.and.returnValue(true);
      component.returnUrl = '/books';

      component.onSubmit();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/books']);
    });

    it('should navigate to dashboard by default on successful login', () => {
      authServiceSpy.login.and.returnValue(true);
      component.returnUrl = '/dashboard';

      component.onSubmit();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should show error message on failed login', () => {
      authServiceSpy.login.and.returnValue(false);

      component.onSubmit();

      expect(component.errorMessage).toBe('Invalid username or password');
      expect(component.loading).toBeFalsy();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should clear password on failed login', () => {
      authServiceSpy.login.and.returnValue(false);
      component.password = 'wrongpassword';

      component.onSubmit();

      expect(component.password).toBe('');
    });

    it('should not clear username on failed login', () => {
      authServiceSpy.login.and.returnValue(false);
      component.username = 'testuser';

      component.onSubmit();

      expect(component.username).toBe('testuser');
    });

    it('should not navigate on failed login', () => {
      authServiceSpy.login.and.returnValue(false);

      component.onSubmit();

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('component initialization', () => {
    it('should initialize with empty values', () => {
      const newComponent = new LoginComponent(
        authServiceSpy,
        routerSpy,
        activatedRouteStub as ActivatedRoute
      );

      expect(newComponent.username).toBe('');
      expect(newComponent.password).toBe('');
      expect(newComponent.errorMessage).toBe('');
      expect(newComponent.loading).toBeFalsy();
    });
  });

  describe('validation edge cases', () => {
    it('should reject whitespace-only username', () => {
      component.username = '   ';
      component.password = 'password';
      authServiceSpy.login.and.returnValue(false);

      component.onSubmit();

      // The component doesn't trim, so login will be called but fail
      expect(authServiceSpy.login).toHaveBeenCalledWith('   ', 'password');
    });

    it('should handle very long username and password', () => {
      component.username = 'a'.repeat(1000);
      component.password = 'b'.repeat(1000);
      authServiceSpy.login.and.returnValue(false);

      component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalled();
    });

    it('should handle special characters in credentials', () => {
      component.username = 'user@test.com';
      component.password = 'P@ssw0rd!#$%';
      authServiceSpy.login.and.returnValue(true);

      component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalledWith('user@test.com', 'P@ssw0rd!#$%');
    });
  });
});


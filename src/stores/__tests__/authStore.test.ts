import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '../authStore';
import { AuthService } from '@/services/authService';

// Mock AuthService
jest.mock('@/services/authService', () => ({
  AuthService: {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(),
    resetPassword: jest.fn(),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.clearError();
      result.current.setUser(null);
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('signUp', () => {
    it('should successfully sign up user', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockResponse = { success: true, user: mockUser, error: null };

      (AuthService.signUp as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.signUp({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(AuthService.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should handle signup error', async () => {
      const mockError = 'Email already exists';
      const mockResponse = { success: false, user: null, error: mockError };

      (AuthService.signUp as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.signUp({
          email: 'existing@example.com',
          password: 'password123',
        });
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe(mockError);
    });
  });

  describe('signIn', () => {
    it('should successfully sign in user', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockResponse = { success: true, user: mockUser, error: null };

      (AuthService.signIn as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.signIn({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(AuthService.signIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should handle signin error', async () => {
      const mockError = 'Invalid credentials';
      const mockResponse = { success: false, user: null, error: mockError };

      (AuthService.signIn as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.signIn({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe(mockError);
    });
  });

  describe('signOut', () => {
    it('should successfully sign out user', async () => {
      const mockResponse = { success: true, error: null };

      (AuthService.signOut as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      // Set user first
      act(() => {
        result.current.setUser({ id: '1', email: 'test@example.com' });
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(AuthService.signOut).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle signout error', async () => {
      const mockError = 'Sign out failed';
      const mockResponse = { success: false, error: mockError };

      (AuthService.signOut as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.error).toBe(mockError);
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      const mockResponse = { success: true, user: mockUser, error: null };

      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.getCurrentUser();
      });

      expect(AuthService.getCurrentUser).toHaveBeenCalled();
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle no current user', async () => {
      const mockResponse = { success: false, user: null, error: 'No user found' };

      (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.getCurrentUser();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set error first
      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should set user and update authentication state', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = { id: '1', email: 'test@example.com' };

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should clear user and update authentication state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUser(null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
}); 
import { AuthService } from '../authService';
import { supabase } from '../supabase';

// Mock supabase
jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      resetPasswordForEmail: jest.fn(),
    },
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
      };

      const mockResponse = {
        data: { user: mockUser },
        error: null,
      };

      (supabase.auth.signUp as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual({
        success: true,
        user: mockUser,
        error: null,
      });
    });

    it('should handle signup error', async () => {
      const mockError = { message: 'Email already exists' };
      const mockResponse = {
        data: { user: null },
        error: mockError,
      };

      (supabase.auth.signUp as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.signUp({
        email: 'existing@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        success: false,
        user: null,
        error: mockError.message,
      });
    });
  });

  describe('signIn', () => {
    it('should successfully sign in user', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
      };

      const mockResponse = {
        data: { user: mockUser },
        error: null,
      };

      (supabase.auth.signIn as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(supabase.auth.signIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual({
        success: true,
        user: mockUser,
        error: null,
      });
    });

    it('should handle signin error', async () => {
      const mockError = { message: 'Invalid credentials' };
      const mockResponse = {
        data: { user: null },
        error: mockError,
      };

      (supabase.auth.signIn as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.signIn({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(result).toEqual({
        success: false,
        user: null,
        error: mockError.message,
      });
    });
  });

  describe('signOut', () => {
    it('should successfully sign out user', async () => {
      const mockResponse = {
        error: null,
      };

      (supabase.auth.signOut as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        error: null,
      });
    });

    it('should handle signout error', async () => {
      const mockError = { message: 'Sign out failed' };
      const mockResponse = {
        error: mockError,
      };

      (supabase.auth.signOut as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.signOut();

      expect(result).toEqual({
        success: false,
        error: mockError.message,
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
      };

      const mockResponse = {
        data: { user: mockUser },
        error: null,
      };

      (supabase.auth.getSession as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.getCurrentUser();

      expect(supabase.auth.getSession).toHaveBeenCalled();
      expect(result).toEqual({
        success: true,
        user: mockUser,
        error: null,
      });
    });

    it('should handle no current user', async () => {
      const mockResponse = {
        data: { user: null },
        error: null,
      };

      (supabase.auth.getSession as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.getCurrentUser();

      expect(result).toEqual({
        success: false,
        user: null,
        error: 'No user found',
      });
    });
  });

  describe('resetPassword', () => {
    it('should successfully send reset password email', async () => {
      const mockResponse = {
        error: null,
      };

      (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.resetPassword('test@example.com');

      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual({
        success: true,
        error: null,
      });
    });

    it('should handle reset password error', async () => {
      const mockError = { message: 'Email not found' };
      const mockResponse = {
        error: mockError,
      };

      (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue(mockResponse);

      const result = await AuthService.resetPassword('nonexistent@example.com');

      expect(result).toEqual({
        success: false,
        error: mockError.message,
      });
    });
  });
}); 
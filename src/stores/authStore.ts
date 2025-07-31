import { create } from 'zustand';
import { User } from '@/types';
import { AuthService, SignUpData, SignInData } from '@/services/authService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthActions {
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  // Actions
  signUp: async (data: SignUpData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await AuthService.signUp(data);

      if (response.success && response.user) {
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: response.error || 'Kayıt işlemi başarısız.',
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: 'Beklenmeyen bir hata oluştu.',
      });
    }
  },

  signIn: async (data: SignInData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await AuthService.signIn(data);

      if (response.success && response.user) {
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: response.error || 'Giriş işlemi başarısız.',
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: 'Beklenmeyen bir hata oluştu.',
      });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await AuthService.signOut();

      if (response.success) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          isLoading: false,
          error: response.error || 'Çıkış işlemi başarısız.',
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: 'Beklenmeyen bir hata oluştu.',
      });
    }
  },

  getCurrentUser: async () => {
    set({ isLoading: true, error: null });

    try {
      const user = await AuthService.getCurrentUser();

      if (user) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },
})); 
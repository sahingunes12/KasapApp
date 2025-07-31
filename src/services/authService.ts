import { supabase } from './supabase';
import { User, UserProfile } from '@/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return {
          success: false,
          error: authError.message,
        };
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            language: 'tr',
            notification_preferences: {
              pushNotifications: true,
              emailNotifications: true,
              orderUpdates: true,
              mediaUpdates: true,
              appointmentReminders: true,
            },
          });

        if (profileError) {
          return {
            success: false,
            error: profileError.message,
          };
        }

        const user: User = {
          id: authData.user.id,
          email: authData.user.email!,
          profile: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            language: 'tr',
            notificationPreferences: {
              pushNotifications: true,
              emailNotifications: true,
              orderUpdates: true,
              mediaUpdates: true,
              appointmentReminders: true,
            },
          },
          createdAt: new Date(authData.user.created_at),
        };

        return {
          success: true,
          user,
        };
      }

      return {
        success: false,
        error: 'Kullanıcı oluşturulamadı.',
      };
    } catch (error) {
      return {
        success: false,
        error: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }

  /**
   * Sign in existing user
   */
  static async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return {
          success: false,
          error: authError.message,
        };
      }

      if (authData.user) {
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          return {
            success: false,
            error: profileError.message,
          };
        }

        const user: User = {
          id: authData.user.id,
          email: authData.user.email!,
          profile: {
            firstName: profileData.first_name,
            lastName: profileData.last_name,
            phone: profileData.phone,
            language: profileData.language as 'tr' | 'en' | 'ar',
            notificationPreferences: profileData.notification_preferences,
          },
          createdAt: new Date(authData.user.created_at),
        };

        return {
          success: true,
          user,
        };
      }

      return {
        success: false,
        error: 'Giriş başarısız.',
      };
    } catch (error) {
      return {
        success: false,
        error: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return null;
      }

      const currentUser: User = {
        id: user.id,
        email: user.email!,
        profile: {
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          phone: profileData.phone,
          language: profileData.language as 'tr' | 'en' | 'ar',
          notificationPreferences: profileData.notification_preferences,
        },
        createdAt: new Date(user.created_at),
      };

      return currentUser;
    } catch (error) {
      return null;
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'kasapapp://reset-password',
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<AuthResponse> {
    try {
      const updateData: any = {};

      if (profile.firstName) updateData.first_name = profile.firstName;
      if (profile.lastName) updateData.last_name = profile.lastName;
      if (profile.phone !== undefined) updateData.phone = profile.phone;
      if (profile.language) updateData.language = profile.language;
      if (profile.notificationPreferences) updateData.notification_preferences = profile.notificationPreferences;

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }
} 
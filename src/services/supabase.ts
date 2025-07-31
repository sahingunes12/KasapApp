import { createClient } from '@supabase/supabase-js';
import { API_BASE_URL, API_KEY } from '@/constants';

// Supabase client configuration
export const supabase = createClient(API_BASE_URL, API_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Database types for KasapApp
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'customer' | 'butcher' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'customer' | 'butcher' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'customer' | 'butcher' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          language: 'tr' | 'en' | 'ar';
          notification_preferences: {
            email: boolean;
            push: boolean;
            sms: boolean;
          };
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          language?: 'tr' | 'en' | 'ar';
          notification_preferences?: {
            email: boolean;
            push: boolean;
            sms: boolean;
          };
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          language?: 'tr' | 'en' | 'ar';
          notification_preferences?: {
            email: boolean;
            push: boolean;
            sms: boolean;
          };
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      charity_organizations: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          logo_url: string | null;
          website_url: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          logo_url?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          logo_url?: string | null;
          website_url?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          service_type: 'kurban' | 'adak' | 'sukur';
          delivery_type: 'personal' | 'charity' | 'restaurant' | 'africa';
          status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'delivered' | 'donated';
          total_amount: number;
          currency: string;
          special_notes: string | null;
          charity_organization_id: string | null;
          appointment_date: string | null;
          payment_method: 'paypal' | 'iban' | 'local' | null;
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_type: 'kurban' | 'adak' | 'sukur';
          delivery_type: 'personal' | 'charity' | 'restaurant' | 'africa';
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'delivered' | 'donated';
          total_amount: number;
          currency?: string;
          special_notes?: string | null;
          charity_organization_id?: string | null;
          appointment_date?: string | null;
          payment_method?: 'paypal' | 'iban' | 'local' | null;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_type?: 'kurban' | 'adak' | 'sukur';
          delivery_type?: 'personal' | 'charity' | 'restaurant' | 'africa';
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'delivered' | 'donated';
          total_amount?: number;
          currency?: string;
          special_notes?: string | null;
          charity_organization_id?: string | null;
          appointment_date?: string | null;
          payment_method?: 'paypal' | 'iban' | 'local' | null;
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_reference?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      time_slots: {
        Row: {
          id: string;
          date: string;
          start_time: string;
          end_time: string;
          max_capacity: number;
          current_bookings: number;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          start_time: string;
          end_time: string;
          max_capacity?: number;
          current_bookings?: number;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          max_capacity?: number;
          current_bookings?: number;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          order_id: string | null;
          time_slot_id: string;
          user_id: string;
          status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          time_slot_id: string;
          user_id: string;
          status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          time_slot_id?: string;
          user_id?: string;
          status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      media_files: {
        Row: {
          id: string;
          order_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number | null;
          mime_type: string | null;
          uploaded_by: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size?: number | null;
          mime_type?: string | null;
          uploaded_by: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          file_name?: string;
          file_url?: string;
          file_type?: string;
          file_size?: number | null;
          mime_type?: string | null;
          uploaded_by?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          order_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          is_anonymous: boolean;
          is_approved: boolean;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          is_anonymous?: boolean;
          is_approved?: boolean;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          is_anonymous?: boolean;
          is_approved?: boolean;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      service_type: 'kurban' | 'adak' | 'sukur';
      delivery_type: 'personal' | 'charity' | 'restaurant' | 'africa';
      order_status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'delivered' | 'donated';
      payment_method: 'paypal' | 'iban' | 'local';
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
      user_role: 'customer' | 'butcher' | 'admin';
      language: 'tr' | 'en' | 'ar';
      appointment_status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    };
  };
} 
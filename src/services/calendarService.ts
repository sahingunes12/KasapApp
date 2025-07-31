import { supabase } from './supabase';

export interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_bookings: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  order_id?: string;
  time_slot_id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentWithRelations extends Appointment {
  time_slot: TimeSlot;
  order?: {
    id: string;
    service_type: string;
    delivery_type: string;
  };
}

export interface CreateAppointmentData {
  time_slot_id: string;
  order_id?: string;
  notes?: string;
}

export interface AvailableTimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  available_spots: number;
}

export class CalendarService {
  /**
   * Get available time slots for a specific date range
   */
  static async getAvailableTimeSlots(
    startDate: string,
    endDate: string
  ): Promise<AvailableTimeSlot[]> {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .eq('is_available', true)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      return (data || []).map(slot => ({
        id: slot.id,
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        available_spots: slot.max_capacity - slot.current_bookings,
      }));
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      throw new Error('Failed to fetch available time slots');
    }
  }

  /**
   * Get time slots for a specific date
   */
  static async getTimeSlotsForDate(date: string): Promise<TimeSlot[]> {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('date', date)
        .order('start_time', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching time slots for date:', error);
      throw new Error('Failed to fetch time slots for date');
    }
  }

  /**
   * Create a new appointment
   */
  static async createAppointment(
    appointmentData: CreateAppointmentData
  ): Promise<Appointment> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Check if time slot is still available
      const { data: timeSlot, error: slotError } = await supabase
        .from('time_slots')
        .select('*')
        .eq('id', appointmentData.time_slot_id)
        .eq('is_available', true)
        .single();

      if (slotError || !timeSlot) {
        throw new Error('Selected time slot is no longer available');
      }

      // Create appointment
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          time_slot_id: appointmentData.time_slot_id,
          order_id: appointmentData.order_id,
          notes: appointmentData.notes,
          status: 'PENDING',
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error('Failed to create appointment');
    }
  }

  /**
   * Get user's appointments
   */
  static async getUserAppointments(): Promise<AppointmentWithRelations[]> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          time_slot:time_slots(*),
          order:orders(id, service_type, delivery_type)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      throw new Error('Failed to fetch user appointments');
    }
  }

  /**
   * Get appointment by ID
   */
  static async getAppointmentById(appointmentId: string): Promise<AppointmentWithRelations> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          time_slot:time_slots(*),
          order:orders(id, service_type, delivery_type)
        `)
        .eq('id', appointmentId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      throw new Error('Failed to fetch appointment');
    }
  }

  /**
   * Update appointment status
   */
  static async updateAppointmentStatus(
    appointmentId: string,
    status: Appointment['status']
  ): Promise<Appointment> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw new Error('Failed to update appointment status');
    }
  }

  /**
   * Cancel appointment
   */
  static async cancelAppointment(appointmentId: string): Promise<Appointment> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Check if user owns the appointment
      const { data: appointment, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !appointment) {
        throw new Error('Appointment not found or access denied');
      }

      // Update status to cancelled
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'CANCELLED' })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw new Error('Failed to cancel appointment');
    }
  }

  /**
   * Check if time slot is available
   */
  static async isTimeSlotAvailable(timeSlotId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('is_available, current_bookings, max_capacity')
        .eq('id', timeSlotId)
        .single();

      if (error) throw error;

      return data.is_available && data.current_bookings < data.max_capacity;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
  }

  /**
   * Get upcoming appointments for user
   */
  static async getUpcomingAppointments(): Promise<AppointmentWithRelations[]> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          time_slot:time_slots(*),
          order:orders(id, service_type, delivery_type)
        `)
        .eq('user_id', user.id)
        .in('status', ['PENDING', 'CONFIRMED'])
        .gte('time_slot.date', new Date().toISOString().split('T')[0])
        .order('time_slot.date', { ascending: true })
        .order('time_slot.start_time', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      throw new Error('Failed to fetch upcoming appointments');
    }
  }

  /**
   * Get appointment statistics for user
   */
  static async getAppointmentStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  }> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('appointments')
        .select('status')
        .eq('user_id', user.id);

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter(a => a.status === 'PENDING').length,
        confirmed: data.filter(a => a.status === 'CONFIRMED').length,
        completed: data.filter(a => a.status === 'COMPLETED').length,
        cancelled: data.filter(a => a.status === 'CANCELLED').length,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
      throw new Error('Failed to fetch appointment statistics');
    }
  }
} 
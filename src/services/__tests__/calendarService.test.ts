import { CalendarService, type TimeSlot, type Appointment, type CreateAppointmentData } from '../calendarService';
import { supabase } from '../supabase';

// Mock supabase
jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('CalendarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAvailableTimeSlots', () => {
    it('should fetch available time slots for date range', async () => {
      const mockData = [
        {
          id: '1',
          date: '2025-01-01',
          start_time: '09:00',
          end_time: '10:00',
          max_capacity: 3,
          current_bookings: 1,
          is_available: true,
        },
      ];

      const mockSelect = jest.fn().mockReturnValue({
        gte: jest.fn().mockReturnValue({
          lte: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
              }),
            }),
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await CalendarService.getAvailableTimeSlots('2025-01-01', '2025-01-07');

      expect(result).toEqual([
        {
          id: '1',
          date: '2025-01-01',
          start_time: '09:00',
          end_time: '10:00',
          available_spots: 2,
        },
      ]);
    });

    it('should throw error when fetch fails', async () => {
      const mockSelect = jest.fn().mockReturnValue({
        gte: jest.fn().mockReturnValue({
          lte: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({ data: null, error: 'Database error' }),
              }),
            }),
          }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      await expect(CalendarService.getAvailableTimeSlots('2025-01-01', '2025-01-07'))
        .rejects.toThrow('Failed to fetch available time slots');
    });
  });

  describe('getTimeSlotsForDate', () => {
    it('should fetch time slots for specific date', async () => {
      const mockData = [
        {
          id: '1',
          date: '2025-01-01',
          start_time: '09:00',
          end_time: '10:00',
          max_capacity: 3,
          current_bookings: 1,
          is_available: true,
        },
      ];

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await CalendarService.getTimeSlotsForDate('2025-01-01');

      expect(result).toEqual(mockData);
    });
  });

  describe('createAppointment', () => {
    it('should create appointment successfully', async () => {
      const mockUser = { id: 'user-1' };
      const mockTimeSlot = {
        id: 'slot-1',
        is_available: true,
        max_capacity: 3,
        current_bookings: 1,
      };
      const mockAppointment = {
        id: 'appointment-1',
        user_id: 'user-1',
        time_slot_id: 'slot-1',
        status: 'PENDING',
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockTimeSlot, error: null }),
            }),
          }),
        }),
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockAppointment, error: null }),
          }),
        }),
      });

      mockSupabase.from.mockImplementation(mockFrom);

      const appointmentData: CreateAppointmentData = {
        time_slot_id: 'slot-1',
        notes: 'Test appointment',
      };

      const result = await CalendarService.createAppointment(appointmentData);

      expect(result).toEqual(mockAppointment);
    });

    it('should throw error when user not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

      const appointmentData: CreateAppointmentData = {
        time_slot_id: 'slot-1',
      };

      await expect(CalendarService.createAppointment(appointmentData))
        .rejects.toThrow('User not authenticated');
    });

    it('should throw error when time slot not available', async () => {
      const mockUser = { id: 'user-1' };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null, error: 'Not found' }),
            }),
          }),
        }),
      });

      mockSupabase.from.mockImplementation(mockFrom);

      const appointmentData: CreateAppointmentData = {
        time_slot_id: 'slot-1',
      };

      await expect(CalendarService.createAppointment(appointmentData))
        .rejects.toThrow('Selected time slot is no longer available');
    });
  });

  describe('getUserAppointments', () => {
    it('should fetch user appointments', async () => {
      const mockUser = { id: 'user-1' };
      const mockData = [
        {
          id: 'appointment-1',
          user_id: 'user-1',
          time_slot: {
            id: 'slot-1',
            date: '2025-01-01',
            start_time: '09:00',
            end_time: '10:00',
          },
        },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      mockSupabase.from.mockImplementation(mockFrom);

      const result = await CalendarService.getUserAppointments();

      expect(result).toEqual(mockData);
    });
  });

  describe('cancelAppointment', () => {
    it('should cancel appointment successfully', async () => {
      const mockUser = { id: 'user-1' };
      const mockAppointment = {
        id: 'appointment-1',
        user_id: 'user-1',
        status: 'PENDING',
      };
      const mockCancelledAppointment = {
        ...mockAppointment,
        status: 'CANCELLED',
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockAppointment, error: null }),
            }),
          }),
        }),
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: mockCancelledAppointment, error: null }),
            }),
          }),
        }),
      });

      mockSupabase.from.mockImplementation(mockFrom);

      const result = await CalendarService.cancelAppointment('appointment-1');

      expect(result.status).toBe('CANCELLED');
    });

    it('should throw error when appointment not found', async () => {
      const mockUser = { id: 'user-1' };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: null, error: 'Not found' }),
            }),
          }),
        }),
      });

      mockSupabase.from.mockImplementation(mockFrom);

      await expect(CalendarService.cancelAppointment('appointment-1'))
        .rejects.toThrow('Appointment not found or access denied');
    });
  });

  describe('isTimeSlotAvailable', () => {
    it('should return true when time slot is available', async () => {
      const mockData = {
        is_available: true,
        current_bookings: 1,
        max_capacity: 3,
      };

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      mockSupabase.from.mockImplementation(mockFrom);

      const result = await CalendarService.isTimeSlotAvailable('slot-1');

      expect(result).toBe(true);
    });

    it('should return false when time slot is not available', async () => {
      const mockData = {
        is_available: false,
        current_bookings: 3,
        max_capacity: 3,
      };

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      mockSupabase.from.mockImplementation(mockFrom);

      const result = await CalendarService.isTimeSlotAvailable('slot-1');

      expect(result).toBe(false);
    });
  });

  describe('getAppointmentStats', () => {
    it('should return appointment statistics', async () => {
      const mockUser = { id: 'user-1' };
      const mockData = [
        { status: 'PENDING' },
        { status: 'CONFIRMED' },
        { status: 'COMPLETED' },
        { status: 'CANCELLED' },
        { status: 'PENDING' },
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });

      const mockFrom = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            mockResolvedValue: jest.fn().mockResolvedValue({ data: mockData, error: null }),
          }),
        }),
      });

      mockSupabase.from.mockImplementation(mockFrom);

      const result = await CalendarService.getAppointmentStats();

      expect(result).toEqual({
        total: 5,
        pending: 2,
        confirmed: 1,
        completed: 1,
        cancelled: 1,
      });
    });
  });
}); 
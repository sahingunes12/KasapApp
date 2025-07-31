import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { CalendarScreen } from '../CalendarScreen';
import { CalendarService } from '@/services/calendarService';

// Mock CalendarService
jest.mock('@/services/calendarService', () => ({
  CalendarService: {
    getUserAppointments: jest.fn(),
    getAvailableTimeSlots: jest.fn(),
    createAppointment: jest.fn(),
    cancelAppointment: jest.fn(),
  },
}));

const mockCalendarService = CalendarService as jest.Mocked<typeof CalendarService>;

// Mock Alert
const mockAlert = jest.fn();
jest.spyOn(require('react-native'), 'Alert').mockImplementation({
  alert: mockAlert,
});

describe('CalendarScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render calendar screen with header', () => {
      mockCalendarService.getUserAppointments.mockResolvedValue([]);
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue([]);

      render(<CalendarScreen navigation={mockNavigation} />);

      expect(screen.getByText('Takvim')).toBeTruthy();
      expect(screen.getByText('Randevu planlayın ve mevcut randevularınızı görüntüleyin')).toBeTruthy();
    });

    it('should render calendar days section', () => {
      mockCalendarService.getUserAppointments.mockResolvedValue([]);
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue([]);

      render(<CalendarScreen navigation={mockNavigation} />);

      expect(screen.getByText('Bu Hafta')).toBeTruthy();
    });

    it('should render time slots section', () => {
      mockCalendarService.getUserAppointments.mockResolvedValue([]);
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue([]);

      render(<CalendarScreen navigation={mockNavigation} />);

      expect(screen.getByText('Müsait Zaman Dilimleri')).toBeTruthy();
    });

    it('should render user appointments section', () => {
      mockCalendarService.getUserAppointments.mockResolvedValue([]);
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue([]);

      render(<CalendarScreen navigation={mockNavigation} />);

      expect(screen.getByText('Randevularım')).toBeTruthy();
    });
  });

  describe('Loading States', () => {
    it('should show loading indicator when loading appointments', async () => {
      mockCalendarService.getUserAppointments.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      );
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue([]);

      render(<CalendarScreen navigation={mockNavigation} />);

      expect(screen.getByText('Randevular yükleniyor...')).toBeTruthy();
    });

    it('should show loading indicator when loading time slots', async () => {
      mockCalendarService.getUserAppointments.mockResolvedValue([]);
      mockCalendarService.getAvailableTimeSlots.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve([]), 100))
      );

      render(<CalendarScreen navigation={mockNavigation} />);

      expect(screen.getByText('Müsait zaman dilimleri yükleniyor...')).toBeTruthy();
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no appointments', async () => {
      mockCalendarService.getUserAppointments.mockResolvedValue([]);
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue([]);

      render(<CalendarScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(screen.getByText('Henüz randevunuz bulunmuyor.')).toBeTruthy();
      });
    });

    it('should show message when no time slots for selected date', async () => {
      mockCalendarService.getUserAppointments.mockResolvedValue([]);
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue([]);

      render(<CalendarScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(screen.getByText('Tarih seçiniz')).toBeTruthy();
      });
    });
  });

  describe('Appointment Display', () => {
    it('should display user appointments correctly', async () => {
      const mockAppointments = [
        {
          id: '1',
          user_id: 'user-1',
          time_slot_id: 'slot-1',
          status: 'PENDING' as const,
          notes: 'Test appointment',
          created_at: '2025-01-01T10:00:00Z',
          updated_at: '2025-01-01T10:00:00Z',
          time_slot: {
            id: 'slot-1',
            date: '2025-01-01',
            start_time: '09:00',
            end_time: '10:00',
            max_capacity: 3,
            current_bookings: 1,
            is_available: true,
            created_at: '2025-01-01T10:00:00Z',
            updated_at: '2025-01-01T10:00:00Z',
          },
        },
      ];

      mockCalendarService.getUserAppointments.mockResolvedValue(mockAppointments);
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue([]);

      render(<CalendarScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(screen.getByText('Beklemede')).toBeTruthy();
        expect(screen.getByText('Not: Test appointment')).toBeTruthy();
      });
    });

    it('should display different status colors correctly', async () => {
      const mockAppointments = [
        {
          id: '1',
          user_id: 'user-1',
          time_slot_id: 'slot-1',
          status: 'CONFIRMED' as const,
          notes: null,
          created_at: '2025-01-01T10:00:00Z',
          updated_at: '2025-01-01T10:00:00Z',
          time_slot: {
            id: 'slot-1',
            date: '2025-01-01',
            start_time: '09:00',
            end_time: '10:00',
            max_capacity: 3,
            current_bookings: 1,
            is_available: true,
            created_at: '2025-01-01T10:00:00Z',
            updated_at: '2025-01-01T10:00:00Z',
          },
        },
      ];

      mockCalendarService.getUserAppointments.mockResolvedValue(mockAppointments);
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue([]);

      render(<CalendarScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(screen.getByText('Onaylandı')).toBeTruthy();
      });
    });
  });

  describe('Time Slot Selection', () => {
    it('should display available time slots', async () => {
      const mockTimeSlots = [
        {
          id: 'slot-1',
          date: '2025-01-01',
          start_time: '09:00',
          end_time: '10:00',
          available_spots: 2,
        },
      ];

      mockCalendarService.getUserAppointments.mockResolvedValue([]);
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue(mockTimeSlots);

      render(<CalendarScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(screen.getByText('09:00 - 10:00')).toBeTruthy();
        expect(screen.getByText('Müsait yer: 2')).toBeTruthy();
        expect(screen.getByText('Rezervasyon')).toBeTruthy();
      });
    });

    it('should handle time slot selection', async () => {
      const mockTimeSlots = [
        {
          id: 'slot-1',
          date: '2025-01-01',
          start_time: '09:00',
          end_time: '10:00',
          available_spots: 2,
        },
      ];

      mockCalendarService.getUserAppointments.mockResolvedValue([]);
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue(mockTimeSlots);
      mockCalendarService.createAppointment.mockResolvedValue({
        id: 'appointment-1',
        user_id: 'user-1',
        time_slot_id: 'slot-1',
        status: 'PENDING',
        created_at: '2025-01-01T10:00:00Z',
        updated_at: '2025-01-01T10:00:00Z',
      });

      render(<CalendarScreen navigation={mockNavigation} />);

      await waitFor(() => {
        const reservationButton = screen.getByText('Rezervasyon');
        fireEvent.press(reservationButton);
      });

      await waitFor(() => {
        expect(mockCalendarService.createAppointment).toHaveBeenCalledWith({
          time_slot_id: 'slot-1',
          notes: 'Randevu oluşturuldu',
        });
      });
    });
  });

  describe('Appointment Cancellation', () => {
    it('should show confirmation dialog when cancelling appointment', async () => {
      const mockAppointments = [
        {
          id: '1',
          user_id: 'user-1',
          time_slot_id: 'slot-1',
          status: 'PENDING' as const,
          notes: null,
          created_at: '2025-01-01T10:00:00Z',
          updated_at: '2025-01-01T10:00:00Z',
          time_slot: {
            id: 'slot-1',
            date: '2025-01-01',
            start_time: '09:00',
            end_time: '10:00',
            max_capacity: 3,
            current_bookings: 1,
            is_available: true,
            created_at: '2025-01-01T10:00:00Z',
            updated_at: '2025-01-01T10:00:00Z',
          },
        },
      ];

      mockCalendarService.getUserAppointments.mockResolvedValue(mockAppointments);
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue([]);
      mockCalendarService.cancelAppointment.mockResolvedValue({
        id: '1',
        user_id: 'user-1',
        time_slot_id: 'slot-1',
        status: 'CANCELLED',
        created_at: '2025-01-01T10:00:00Z',
        updated_at: '2025-01-01T10:00:00Z',
      });

      render(<CalendarScreen navigation={mockNavigation} />);

      await waitFor(() => {
        const cancelButton = screen.getByText('İptal Et');
        fireEvent.press(cancelButton);
      });

      expect(mockAlert).toHaveBeenCalledWith(
        'Randevu İptali',
        'Bu randevuyu iptal etmek istediğinizden emin misiniz?',
        expect.any(Array)
      );
    });
  });

  describe('Error Handling', () => {
    it('should show error alert when loading appointments fails', async () => {
      mockCalendarService.getUserAppointments.mockRejectedValue(new Error('Network error'));
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue([]);

      render(<CalendarScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Hata', 'Randevular yüklenirken bir hata oluştu.');
      });
    });

    it('should show error alert when loading time slots fails', async () => {
      mockCalendarService.getUserAppointments.mockResolvedValue([]);
      mockCalendarService.getAvailableTimeSlots.mockRejectedValue(new Error('Network error'));

      render(<CalendarScreen navigation={mockNavigation} />);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Hata', 'Müsait zaman dilimleri yüklenirken bir hata oluştu.');
      });
    });

    it('should show error alert when creating appointment fails', async () => {
      const mockTimeSlots = [
        {
          id: 'slot-1',
          date: '2025-01-01',
          start_time: '09:00',
          end_time: '10:00',
          available_spots: 2,
        },
      ];

      mockCalendarService.getUserAppointments.mockResolvedValue([]);
      mockCalendarService.getAvailableTimeSlots.mockResolvedValue(mockTimeSlots);
      mockCalendarService.createAppointment.mockRejectedValue(new Error('Creation failed'));

      render(<CalendarScreen navigation={mockNavigation} />);

      await waitFor(() => {
        const reservationButton = screen.getByText('Rezervasyon');
        fireEvent.press(reservationButton);
      });

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Hata', 'Randevu oluşturulurken bir hata oluştu.');
      });
    });
  });
}); 
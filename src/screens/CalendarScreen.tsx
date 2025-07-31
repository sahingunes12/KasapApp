import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { CalendarService, type AvailableTimeSlot, type AppointmentWithRelations } from '@/services/calendarService';

interface CalendarScreenProps {
  navigation: any;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlot[]>([]);
  const [userAppointments, setUserAppointments] = useState<AppointmentWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState(today);

  useEffect(() => {
    loadUserAppointments();
    loadAvailableSlots();
  }, []);

  const loadUserAppointments = async () => {
    try {
      setLoading(true);
      const appointments = await CalendarService.getUserAppointments();
      setUserAppointments(appointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      Alert.alert('Hata', 'Randevular yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // Next 30 days
      
      const slots = await CalendarService.getAvailableTimeSlots(
        currentDate,
        endDate.toISOString().split('T')[0]
      );
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading time slots:', error);
      Alert.alert('Hata', 'Müsait zaman dilimleri yüklenirken bir hata oluştu.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // Filter slots for selected date
    const slotsForDate = availableSlots.filter(slot => slot.date === date);
    // You can add additional logic here if needed
  };

  const handleSlotSelect = async (slot: AvailableTimeSlot) => {
    try {
      setLoading(true);
      
      const appointment = await CalendarService.createAppointment({
        time_slot_id: slot.id,
        notes: 'Randevu oluşturuldu',
      });

      Alert.alert(
        'Başarılı',
        'Randevunuz başarıyla oluşturuldu!',
        [
          {
            text: 'Tamam',
            onPress: () => {
              loadUserAppointments();
              loadAvailableSlots();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating appointment:', error);
      Alert.alert('Hata', 'Randevu oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    Alert.alert(
      'Randevu İptali',
      'Bu randevuyu iptal etmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Evet',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await CalendarService.cancelAppointment(appointmentId);
              Alert.alert('Başarılı', 'Randevunuz iptal edildi.');
              loadUserAppointments();
              loadAvailableSlots();
            } catch (error) {
              console.error('Error cancelling appointment:', error);
              Alert.alert('Hata', 'Randevu iptal edilirken bir hata oluştu.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Remove seconds if present
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#f59e0b';
      case 'CONFIRMED':
        return '#10b981';
      case 'COMPLETED':
        return '#3b82f6';
      case 'CANCELLED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Beklemede';
      case 'CONFIRMED':
        return 'Onaylandı';
      case 'COMPLETED':
        return 'Tamamlandı';
      case 'CANCELLED':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const startDate = new Date(currentDate);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const isSelected = selectedDate === dateString;
      const hasAppointment = userAppointments.some(
        apt => apt.time_slot.date === dateString
      );

      days.push(
        <TouchableOpacity
          key={dateString}
          style={{
            padding: 12,
            margin: 4,
            borderRadius: 8,
            backgroundColor: isSelected ? '#f2751a' : '#f3f4f6',
            borderWidth: hasAppointment ? 2 : 0,
            borderColor: hasAppointment ? '#10b981' : 'transparent',
          }}
          onPress={() => handleDateSelect(dateString)}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: isSelected ? 'white' : '#374151',
              textAlign: 'center',
            }}
          >
            {date.toLocaleDateString('tr-TR', { weekday: 'short' })}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: isSelected ? 'white' : '#374151',
              textAlign: 'center',
            }}
          >
            {date.getDate()}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const renderTimeSlots = () => {
    if (loadingSlots) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#f2751a" />
          <Text style={{ marginTop: 10, color: '#6b7280' }}>
            Müsait zaman dilimleri yükleniyor...
          </Text>
        </View>
      );
    }

    const slotsForSelectedDate = availableSlots.filter(
      slot => slot.date === selectedDate
    );

    if (slotsForSelectedDate.length === 0) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#6b7280', fontSize: 16 }}>
            {selectedDate ? 'Bu tarih için müsait zaman dilimi bulunmuyor.' : 'Tarih seçiniz'}
          </Text>
        </View>
      );
    }

    return slotsForSelectedDate.map(slot => (
      <TouchableOpacity
        key={slot.id}
        style={{
          backgroundColor: 'white',
          padding: 16,
          marginVertical: 4,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}
        onPress={() => handleSlotSelect(slot)}
        disabled={loading}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>
              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
              Müsait yer: {slot.available_spots}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#f2751a',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
              Rezervasyon
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  const renderUserAppointments = () => {
    if (loading) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#f2751a" />
          <Text style={{ marginTop: 10, color: '#6b7280' }}>
            Randevular yükleniyor...
          </Text>
        </View>
      );
    }

    if (userAppointments.length === 0) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#6b7280', fontSize: 16 }}>
            Henüz randevunuz bulunmuyor.
          </Text>
        </View>
      );
    }

    return userAppointments.map(appointment => (
      <View
        key={appointment.id}
        style={{
          backgroundColor: 'white',
          padding: 16,
          marginVertical: 4,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>
              {formatDate(appointment.time_slot.date)}
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
              {formatTime(appointment.time_slot.start_time)} - {formatTime(appointment.time_slot.end_time)}
            </Text>
            {appointment.notes && (
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                Not: {appointment.notes}
              </Text>
            )}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View
              style={{
                backgroundColor: getStatusColor(appointment.status),
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                {getStatusText(appointment.status)}
              </Text>
            </View>
            {appointment.status === 'PENDING' && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#ef4444',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}
                onPress={() => handleCancelAppointment(appointment.id)}
              >
                <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
                  İptal Et
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    ));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
            Takvim
          </Text>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>
            Randevu planlayın ve mevcut randevularınızı görüntüleyin
          </Text>
        </View>

        {/* Calendar Days */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
            Bu Hafta
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {renderCalendarDays()}
          </View>
        </View>

        {/* Available Time Slots */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
            Müsait Zaman Dilimleri
          </Text>
          {renderTimeSlots()}
        </View>

        {/* User Appointments */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
            Randevularım
          </Text>
          {renderUserAppointments()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}; 
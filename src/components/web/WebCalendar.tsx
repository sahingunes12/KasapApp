import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';

export const WebCalendar = ({ onBack }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [userAppointments, setUserAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState(today);

  useEffect(() => {
    // For web demo, use mock data instead of real API calls
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock available time slots
    const mockSlots = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      // Add multiple time slots per day
      const timeSlots = [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
      ];
      
      timeSlots.forEach((slot, index) => {
        mockSlots.push({
          id: `slot-${dateString}-${index}`,
          date: dateString,
          start_time: slot.start,
          end_time: slot.end,
          available_spots: Math.floor(Math.random() * 3) + 1,
        });
      });
    }
    
    setAvailableSlots(mockSlots);
    setUserAppointments([]);
  };

  const loadUserAppointments = async () => {
    // For web demo, just refresh mock data
    loadMockData();
  };

  const loadAvailableSlots = async () => {
    // For web demo, just refresh mock data
    loadMockData();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleSlotSelect = async (slot) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create mock appointment
      const newAppointment = {
        id: `appointment-${Date.now()}`,
        user_id: 'demo-user',
        time_slot_id: slot.id,
        status: 'PENDING',
        notes: 'Web üzerinden oluşturuldu',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        time_slot: {
          id: slot.id,
          date: slot.date,
          start_time: slot.start_time,
          end_time: slot.end_time,
          max_capacity: 3,
          current_bookings: 1,
          is_available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
      
      setUserAppointments(prev => [...prev, newAppointment]);
      
      // Update available spots
      setAvailableSlots(prev => 
        prev.map(s => 
          s.id === slot.id 
            ? { ...s, available_spots: s.available_spots - 1 }
            : s
        ).filter(s => s.available_spots > 0)
      );
      
      setLoading(false);
      
      Alert.alert(
        '✅ Demo Başarılı',
        'Randevunuz başarıyla oluşturuldu! (Demo Mode)',
        [{ text: 'Tamam' }]
      );
    }, 1000);
  };

  const handleCancelAppointment = async (appointmentId) => {
    setLoading(true);
    
    setTimeout(() => {
      // Remove appointment from list
      setUserAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
      setLoading(false);
      
      Alert.alert(
        '✅ Demo Başarılı', 
        'Randevunuz iptal edildi! (Demo Mode)',
        [{ text: 'Tamam' }]
      );
    }, 500);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  const getStatusColor = (status) => {
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

  const getStatusText = (status) => {
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
            minWidth: 80,
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
          cursor: 'pointer',
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
                  cursor: 'pointer',
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
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 24, flexDirection: 'row', alignItems: 'center' }}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={{ 
                marginRight: 16, 
                padding: 8, 
                backgroundColor: '#f3f4f6', 
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              <Text style={{ fontSize: 16 }}>← Geri</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
            📅 Takvim (Demo)
          </Text>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>
            Randevu planlayın ve mevcut randevularınızı görüntüleyin • Web demo modu
          </Text>
          </View>
        </View>

        {/* Calendar Days */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginBottom: 12 }}>
            Bu Hafta
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
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
    </View>
  );
};
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { WebButton } from '@/components/web/WebButton';
import { WebCard } from '@/components/web/WebCard';
import { WebLoading } from '@/components/web/WebLoading';

const SERVICE_TYPES = {
  KURBAN: {
    label: 'Kurban',
    price: 2500,
    description: 'Dini kurban hizmeti',
    icon: '🐑',
  },
  ADAK: {
    label: 'Adak',
    price: 1800,
    description: 'Adak kurban hizmeti',
    icon: '🕊️',
  },
  SUKUR: {
    label: 'Şükür',
    price: 1200,
    description: 'Şükür kurban hizmeti',
    icon: '🙏',
  },
};

export const WebHomeScreen = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleServiceSelect = (serviceType) => {
    setSelectedService(serviceType);
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      alert(`${SERVICE_TYPES[serviceType].label} hizmeti seçildi!`);
    }, 1000);
  };

  const handleQuickAction = (action) => {
    alert(`${action} sayfasına yönlendiriliyorsunuz...`);
  };

  if (isLoading) {
    return <WebLoading text="Hizmet yükleniyor..." fullScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 }}>
            🏠 Hoş Geldiniz
          </Text>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>
            Hangi hizmet türünü tercih ediyorsunuz?
          </Text>
        </View>

        {/* Service Selection */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#111827', marginBottom: 16 }}>
            Hizmet Türleri
          </Text>
          
          {Object.entries(SERVICE_TYPES).map(([key, service]) => (
            <WebCard key={key} variant="elevated" style={{ marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => handleServiceSelect(key)}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 32, marginRight: 12 }}>{service.icon}</Text>
                  <View>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
                      {service.label}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6b7280' }}>
                      {service.description}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#f2751a' }}>
                    {service.price} TRY
                  </Text>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>
                    Başlayan fiyat
                  </Text>
                </View>
              </TouchableOpacity>
            </WebCard>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#111827', marginBottom: 16 }}>
            Hızlı İşlemler
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <WebButton
              title="📋 Siparişlerim"
              onPress={() => handleQuickAction('Siparişlerim')}
              variant="outline"
              style={{ flex: 1, minWidth: 150 }}
            />
            <WebButton
              title="📅 Takvim"
              onPress={() => handleQuickAction('Takvim')}
              variant="outline"
              style={{ flex: 1, minWidth: 150 }}
            />
            <WebButton
              title="📸 Medya"
              onPress={() => handleQuickAction('Medya')}
              variant="outline"
              style={{ flex: 1, minWidth: 150 }}
            />
          </View>
        </View>

        {/* Info Section */}
        <WebCard variant="outlined">
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            ℹ️ Bilgilendirme
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', lineHeight: 20 }}>
            KasapApp, dini kurban hizmetleri için güvenilir bir platformdur. 
            Tüm hizmetlerimiz İslami kurallara uygun olarak gerçekleştirilmektedir.
          </Text>
        </WebCard>

        {/* Contact */}
        <WebCard variant="outlined" style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            📞 İletişim
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            Telefon: +90 555 123 45 67{'\n'}
            E-posta: info@kasapapp.com{'\n'}
            Adres: İstanbul, Türkiye
          </Text>
        </WebCard>
      </ScrollView>
    </SafeAreaView>
  );
}; 
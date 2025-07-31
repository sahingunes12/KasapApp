import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SERVICE_TYPES, SERVICE_TYPE_LABELS, DELIVERY_TYPES } from '@/constants';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';

type ServiceType = keyof typeof SERVICE_TYPES;
type DeliveryType = keyof typeof DELIVERY_TYPES;

interface ServiceOption {
  type: ServiceType;
  title: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  icon: string;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    type: 'KURBAN',
    title: 'Kurban',
    description: 'Kurban kesimi ve dağıtımı hizmeti',
    price: 2500,
    currency: 'TRY',
    features: [
      'Profesyonel kesim',
      'Hijyenik ortam',
      'Sertifikalı kasap',
      'Video kayıt',
      'Dağıtım hizmeti',
    ],
    icon: '🐑',
  },
  {
    type: 'ADAK',
    title: 'Adak',
    description: 'Adak kesimi ve dağıtımı hizmeti',
    price: 1800,
    currency: 'TRY',
    features: [
      'Profesyonel kesim',
      'Hijyenik ortam',
      'Sertifikalı kasap',
      'Video kayıt',
      'Dağıtım hizmeti',
    ],
    icon: '🕊️',
  },
  {
    type: 'SUKUR',
    title: 'Şükür',
    description: 'Şükür kesimi ve dağıtımı hizmeti',
    price: 1200,
    currency: 'TRY',
    features: [
      'Profesyonel kesim',
      'Hijyenik ortam',
      'Sertifikalı kasap',
      'Video kayıt',
      'Dağıtım hizmeti',
    ],
    icon: '🙏',
  },
];

type RootStackParamList = {
  Home: undefined;
  OrderDetails: { serviceType: ServiceType };
  Orders: undefined;
  Calendar: undefined;
  Media: undefined;
  Profile: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleServiceSelection = (serviceType: ServiceType) => {
    setSelectedService(serviceType);
  };

  const handleContinue = () => {
    if (!selectedService) {
      Alert.alert('Hata', 'Lütfen bir hizmet türü seçin');
      return;
    }

    navigation.navigate('OrderDetails', { serviceType: selectedService });
  };

  const handleViewOrders = () => {
    navigation.navigate('Orders');
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString('tr-TR')} ${currency}`;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            🏠 Hoş Geldiniz
          </Text>
          <Text className="text-gray-600">
            Hangi hizmet türünü tercih ediyorsunuz?
          </Text>
        </View>

        {/* Service Options */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Hizmet Türleri
          </Text>
          
          {SERVICE_OPTIONS.map((service) => (
            <Card
              key={service.type}
              className={`mb-4 ${
                selectedService === service.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <TouchableOpacity
                onPress={() => handleServiceSelection(service.type)}
                className="p-4"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Text className="text-2xl mr-3">{service.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {service.title}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {service.description}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-blue-600">
                      {formatPrice(service.price, service.currency)}
                    </Text>
                    <Text className="text-xs text-gray-500">Başlangıç</Text>
                  </View>
                </View>

                {/* Features */}
                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Dahil Olan Hizmetler:
                  </Text>
                  <View className="flex-row flex-wrap">
                    {service.features.map((feature, index) => (
                      <View
                        key={index}
                        className="bg-green-100 px-2 py-1 rounded-full mr-2 mb-2"
                      >
                        <Text className="text-xs text-green-700">{feature}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Selection Indicator */}
                {selectedService === service.type && (
                  <View className="bg-blue-100 p-2 rounded-lg">
                    <Text className="text-sm text-blue-700 text-center font-medium">
                      ✓ Seçildi
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Hızlı İşlemler
          </Text>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={handleViewOrders}
              className="flex-1 bg-white border border-gray-200 rounded-lg p-4"
            >
              <Text className="text-center text-lg">📋</Text>
              <Text className="text-center text-sm font-medium text-gray-900 mt-1">
                Siparişlerim
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Calendar')}
              className="flex-1 bg-white border border-gray-200 rounded-lg p-4"
            >
              <Text className="text-center text-lg">📅</Text>
              <Text className="text-center text-sm font-medium text-gray-900 mt-1">
                Takvim
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Media')}
              className="flex-1 bg-white border border-gray-200 rounded-lg p-4"
            >
              <Text className="text-center text-lg">📸</Text>
              <Text className="text-center text-sm font-medium text-gray-900 mt-1">
                Medya
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Information Section */}
        <View className="mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <View className="p-4">
              <Text className="text-lg font-semibold text-blue-900 mb-2">
                ℹ️ Bilgilendirme
              </Text>
              <Text className="text-sm text-blue-800 leading-5">
                • Tüm hizmetlerimiz sertifikalı kasap tarafından gerçekleştirilir{'\n'}
                • Hijyenik ortamda kesim yapılır{'\n'}
                • Video kayıt ile süreç belgelenir{'\n'}
                • Dağıtım hizmeti dahildir{'\n'}
                • Özel notlarınızı ekleyebilirsiniz
              </Text>
            </View>
          </Card>
        </View>

        {/* Continue Button */}
        <View className="mb-6">
          <Button
            title="Devam Et"
            onPress={handleContinue}
            disabled={!selectedService}
            variant={selectedService ? 'primary' : 'disabled'}
            className="w-full"
          />
        </View>

        {/* Contact Information */}
        <View className="mb-4">
          <Card className="bg-gray-50 border-gray-200">
            <View className="p-4">
              <Text className="text-sm text-gray-600 text-center">
                Sorularınız için: 📞 +90 555 123 45 67
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}; 
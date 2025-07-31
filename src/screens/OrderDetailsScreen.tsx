import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DELIVERY_TYPES, DELIVERY_TYPE_LABELS, VALIDATION } from '@/constants';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { OrderService, CreateOrderData } from '@/services/orderService';

type DeliveryType = keyof typeof DELIVERY_TYPES;
type ServiceType = 'KURBAN' | 'ADAK' | 'SUKUR';

interface CharityOrganization {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
}

interface OrderDetailsRouteParams {
  serviceType: ServiceType;
}

type RootStackParamList = {
  OrderDetails: OrderDetailsRouteParams;
  OrderConfirmation: { orderId: string };
  Home: undefined;
};

type OrderDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderDetails'>;
type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;

const DELIVERY_OPTIONS = [
  {
    type: 'PERSONAL' as DeliveryType,
    title: 'Kişisel Teslimat',
    description: 'Kesim sonrası size teslim edilir',
    icon: '🏠',
    price: 0,
  },
  {
    type: 'CHARITY' as DeliveryType,
    title: 'Bağış',
    description: 'Seçtiğiniz yardım kuruluşuna bağışlanır',
    icon: '🤝',
    price: 0,
  },
  {
    type: 'RESTAURANT' as DeliveryType,
    title: 'Restoran',
    description: 'Belirttiğiniz restorana teslim edilir',
    icon: '🍽️',
    price: 50,
  },
  {
    type: 'AFRICA' as DeliveryType,
    title: 'Afrika Dağıtımı',
    description: 'Afrika\'daki ihtiyaç sahiplerine dağıtılır',
    icon: '🌍',
    price: 100,
  },
];

const MOCK_CHARITY_ORGANIZATIONS: CharityOrganization[] = [
  {
    id: '1',
    name: 'Türk Kızılayı',
    description: 'Türkiye Kızılayı Derneği',
    logo_url: null,
  },
  {
    id: '2',
    name: 'İHH İnsani Yardım Vakfı',
    description: 'İnsan Hak ve Hürriyetleri İnsani Yardım Vakfı',
    logo_url: null,
  },
  {
    id: '3',
    name: 'Deniz Feneri Derneği',
    description: 'Deniz Feneri Yardımlaşma ve Dayanışma Derneği',
    logo_url: null,
  },
  {
    id: '4',
    name: 'Afrika Yardım Vakfı',
    description: 'Afrika kıtasında yardım faaliyetleri yürüten vakıf',
    logo_url: null,
  },
];

const SERVICE_PRICES = {
  KURBAN: 2500,
  ADAK: 1800,
  SUKUR: 1200,
};

export const OrderDetailsScreen: React.FC = () => {
  const navigation = useNavigation<OrderDetailsNavigationProp>();
  const route = useRoute<OrderDetailsRouteProp>();
  const { serviceType } = route.params;

  const [selectedDeliveryType, setSelectedDeliveryType] = useState<DeliveryType | null>(null);
  const [selectedCharity, setSelectedCharity] = useState<CharityOrganization | null>(null);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [charityOrganizations, setCharityOrganizations] = useState<CharityOrganization[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from the API
    setCharityOrganizations(MOCK_CHARITY_ORGANIZATIONS);
  }, []);

  const handleDeliveryTypeSelection = (deliveryType: DeliveryType) => {
    setSelectedDeliveryType(deliveryType);
    if (deliveryType !== 'CHARITY') {
      setSelectedCharity(null);
    }
  };

  const handleCharitySelection = (charity: CharityOrganization) => {
    setSelectedCharity(charity);
  };

  const handleCreateOrder = async () => {
    if (!selectedDeliveryType) {
      Alert.alert('Hata', 'Lütfen teslimat türünü seçin');
      return;
    }

    if (selectedDeliveryType === 'CHARITY' && !selectedCharity) {
      Alert.alert('Hata', 'Lütfen bir yardım kuruluşu seçin');
      return;
    }

    if (specialNotes.length > VALIDATION.MAX_SPECIAL_NOTES_LENGTH) {
      Alert.alert('Hata', `Özel notlar ${VALIDATION.MAX_SPECIAL_NOTES_LENGTH} karakterden uzun olamaz`);
      return;
    }

    setIsLoading(true);

    try {
      const orderData: CreateOrderData = {
        serviceType: serviceType.toLowerCase() as any,
        deliveryType: selectedDeliveryType.toLowerCase() as any,
        totalAmount: calculateTotalPrice(),
        currency: 'TRY',
        specialNotes: specialNotes.trim() || undefined,
        charityOrganizationId: selectedCharity?.id,
      };

      // In a real app, you would get the user ID from auth context
      const userId = 'user-123'; // Mock user ID
      const order = await OrderService.createOrder(userId, orderData);

      setIsLoading(false);
      navigation.navigate('OrderConfirmation', { orderId: order.id });
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Hata', error instanceof Error ? error.message : 'Sipariş oluşturulamadı');
    }
  };

  const calculateTotalPrice = (): number => {
    const basePrice = SERVICE_PRICES[serviceType];
    const deliveryPrice = selectedDeliveryType 
      ? DELIVERY_OPTIONS.find(option => option.type === selectedDeliveryType)?.price || 0
      : 0;
    
    return basePrice + deliveryPrice;
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('tr-TR')} TRY`;
  };

  const getServiceInfo = () => {
    const basePrice = SERVICE_PRICES[serviceType];
    const deliveryPrice = selectedDeliveryType 
      ? DELIVERY_OPTIONS.find(option => option.type === selectedDeliveryType)?.price || 0
      : 0;

    return {
      basePrice,
      deliveryPrice,
      totalPrice: basePrice + deliveryPrice,
    };
  };

  if (isLoading) {
    return <Loading />;
  }

  const serviceInfo = getServiceInfo();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Sipariş Detayları
          </Text>
          <Text className="text-gray-600">
            {serviceType} hizmeti için teslimat seçeneklerini belirleyin
          </Text>
        </View>

        {/* Service Summary */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <View className="p-4">
            <Text className="text-lg font-semibold text-blue-900 mb-2">
              Seçilen Hizmet
            </Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-blue-800">{serviceType}</Text>
              <Text className="text-lg font-bold text-blue-900">
                {formatPrice(serviceInfo.basePrice)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Delivery Type Selection */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Teslimat Türü
          </Text>
          
          {DELIVERY_OPTIONS.map((option) => (
            <Card
              key={option.type}
              className={`mb-3 ${
                selectedDeliveryType === option.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <TouchableOpacity
                onPress={() => handleDeliveryTypeSelection(option.type)}
                className="p-4"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <Text className="text-2xl mr-3">{option.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {option.title}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    {option.price > 0 && (
                      <Text className="text-sm text-gray-600">
                        +{formatPrice(option.price)}
                      </Text>
                    )}
                    {selectedDeliveryType === option.type && (
                      <Text className="text-sm text-blue-600 font-medium">
                        ✓ Seçildi
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* Charity Organization Selection */}
        {selectedDeliveryType === 'CHARITY' && (
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Yardım Kuruluşu Seçin
            </Text>
            
            {charityOrganizations.map((charity) => (
              <Card
                key={charity.id}
                className={`mb-3 ${
                  selectedCharity?.id === charity.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <TouchableOpacity
                  onPress={() => handleCharitySelection(charity)}
                  className="p-4"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {charity.name}
                      </Text>
                      {charity.description && (
                        <Text className="text-sm text-gray-600">
                          {charity.description}
                        </Text>
                      )}
                    </View>
                    {selectedCharity?.id === charity.id && (
                      <Text className="text-sm text-green-600 font-medium">
                        ✓ Seçildi
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}

        {/* Special Notes */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Özel Notlar
          </Text>
          
          <Card className="border-gray-200">
            <View className="p-4">
              <TextInput
                className="w-full min-h-[100] text-gray-900 text-base"
                placeholder="Özel isteklerinizi buraya yazabilirsiniz..."
                placeholderTextColor="#9CA3AF"
                value={specialNotes}
                onChangeText={setSpecialNotes}
                multiline
                textAlignVertical="top"
                maxLength={VALIDATION.MAX_SPECIAL_NOTES_LENGTH}
              />
              <Text className="text-xs text-gray-500 mt-2 text-right">
                {specialNotes.length}/{VALIDATION.MAX_SPECIAL_NOTES_LENGTH}
              </Text>
            </View>
          </Card>
        </View>

        {/* Order Summary */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Sipariş Özeti
          </Text>
          
          <Card className="bg-gray-50 border-gray-200">
            <View className="p-4">
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Hizmet:</Text>
                  <Text className="text-gray-900">{serviceType}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Teslimat:</Text>
                  <Text className="text-gray-900">
                    {selectedDeliveryType ? DELIVERY_TYPE_LABELS[selectedDeliveryType] : '-'}
                  </Text>
                </View>
                {selectedCharity && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Yardım Kuruluşu:</Text>
                    <Text className="text-gray-900">{selectedCharity.name}</Text>
                  </View>
                )}
                <View className="border-t border-gray-200 pt-2 mt-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Temel Fiyat:</Text>
                    <Text className="text-gray-900">{formatPrice(serviceInfo.basePrice)}</Text>
                  </View>
                  {serviceInfo.deliveryPrice > 0 && (
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Teslimat Ücreti:</Text>
                      <Text className="text-gray-900">{formatPrice(serviceInfo.deliveryPrice)}</Text>
                    </View>
                  )}
                  <View className="flex-row justify-between pt-2 border-t border-gray-200">
                    <Text className="text-lg font-semibold text-gray-900">Toplam:</Text>
                    <Text className="text-lg font-bold text-blue-600">
                      {formatPrice(serviceInfo.totalPrice)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View className="mb-6 space-y-3">
          <Button
            title="Siparişi Oluştur"
            onPress={handleCreateOrder}
            disabled={!selectedDeliveryType || (selectedDeliveryType === 'CHARITY' && !selectedCharity)}
            variant="primary"
            className="w-full"
          />
          
          <Button
            title="Geri Dön"
            onPress={() => navigation.goBack()}
            variant="secondary"
            className="w-full"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}; 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ORDER_STATUS, ORDER_STATUS_LABELS } from '@/constants';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { OrderService, OrderWithRelations } from '@/services/orderService';

interface OrderConfirmationRouteParams {
  orderId: string;
}

type RootStackParamList = {
  OrderConfirmation: OrderConfirmationRouteParams;
  Home: undefined;
  Orders: undefined;
  Payment: { orderId: string };
};

type OrderConfirmationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderConfirmation'>;
type OrderConfirmationRouteProp = RouteProp<RootStackParamList, 'OrderConfirmation'>;

interface TimelineStep {
  status: string;
  title: string;
  description: string;
  icon: string;
  isCompleted: boolean;
  isActive: boolean;
  timestamp?: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    status: 'pending',
    title: 'Sipariş Alındı',
    description: 'Siparişiniz başarıyla oluşturuldu',
    icon: '📋',
    isCompleted: false,
    isActive: false,
  },
  {
    status: 'scheduled',
    title: 'Planlandı',
    description: 'Kesim tarihi ve saati belirlendi',
    icon: '📅',
    isCompleted: false,
    isActive: false,
  },
  {
    status: 'in_progress',
    title: 'İşlemde',
    description: 'Kesim işlemi başladı',
    icon: '🔪',
    isCompleted: false,
    isActive: false,
  },
  {
    status: 'completed',
    title: 'Tamamlandı',
    description: 'Kesim işlemi tamamlandı',
    icon: '✅',
    isCompleted: false,
    isActive: false,
  },
  {
    status: 'delivered',
    title: 'Teslim Edildi',
    description: 'Siparişiniz teslim edildi',
    icon: '🚚',
    isCompleted: false,
    isActive: false,
  },
];

export const OrderConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<OrderConfirmationNavigationProp>();
  const route = useRoute<OrderConfirmationRouteProp>();
  const { orderId } = route.params;

  const [order, setOrder] = useState<OrderWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>(TIMELINE_STEPS);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      const orderData = await OrderService.getOrderById(orderId);
      setOrder(orderData);
      updateTimelineSteps(orderData?.status || 'pending');
    } catch (error) {
      Alert.alert('Hata', 'Sipariş detayları yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTimelineSteps = (currentStatus: string) => {
    const updatedSteps = TIMELINE_STEPS.map((step, index) => {
      const stepIndex = TIMELINE_STEPS.findIndex(s => s.status === currentStatus);
      const currentStepIndex = TIMELINE_STEPS.findIndex(s => s.status === step.status);
      
      return {
        ...step,
        isCompleted: currentStepIndex < stepIndex,
        isActive: step.status === currentStatus,
      };
    });
    
    setTimelineSteps(updatedSteps);
  };

  const handlePayment = () => {
    if (!order) return;
    
    navigation.navigate('Payment', { orderId: order.id });
  };

  const handleViewOrders = () => {
    navigation.navigate('Orders');
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString('tr-TR')} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-lg text-gray-600 text-center">
            Sipariş bulunamadı
          </Text>
          <Button
            title="Ana Sayfaya Dön"
            onPress={handleGoHome}
            variant="primary"
            className="mt-4"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Sipariş Onaylandı
          </Text>
          <Text className="text-gray-600">
            Siparişiniz başarıyla oluşturuldu
          </Text>
        </View>

        {/* Order ID */}
        <Card className="mb-6 bg-green-50 border-green-200">
          <View className="p-4">
            <Text className="text-lg font-semibold text-green-900 mb-2">
              Sipariş Numarası
            </Text>
            <Text className="text-2xl font-bold text-green-800">
              #{order.id.slice(0, 8).toUpperCase()}
            </Text>
            <Text className="text-sm text-green-700 mt-1">
              Oluşturulma: {formatDate(order.created_at)}
            </Text>
          </View>
        </Card>

        {/* Order Details */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Sipariş Detayları
          </Text>
          
          <Card className="border-gray-200">
            <View className="p-4 space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Hizmet Türü:</Text>
                <Text className="text-gray-900 font-medium">
                  {ORDER_STATUS_LABELS[order.service_type as keyof typeof ORDER_STATUS_LABELS]}
                </Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Teslimat Türü:</Text>
                <Text className="text-gray-900 font-medium">
                  {ORDER_STATUS_LABELS[order.delivery_type as keyof typeof ORDER_STATUS_LABELS]}
                </Text>
              </View>
              
              {order.charity_organization && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Yardım Kuruluşu:</Text>
                  <Text className="text-gray-900 font-medium">
                    {order.charity_organization.name}
                  </Text>
                </View>
              )}
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Toplam Tutar:</Text>
                <Text className="text-lg font-bold text-blue-600">
                  {formatPrice(order.total_amount, order.currency)}
                </Text>
              </View>
              
              {order.special_notes && (
                <View className="pt-3 border-t border-gray-200">
                  <Text className="text-gray-600 mb-1">Özel Notlar:</Text>
                  <Text className="text-gray-900">{order.special_notes}</Text>
                </View>
              )}
            </View>
          </Card>
        </View>

        {/* Status Timeline */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Sipariş Durumu
          </Text>
          
          <Card className="border-gray-200">
            <View className="p-4">
              {timelineSteps.map((step, index) => (
                <View key={step.status} className="mb-4 last:mb-0">
                  <View className="flex-row items-center">
                    {/* Timeline Line */}
                    {index < timelineSteps.length - 1 && (
                      <View className="absolute left-4 top-8 w-0.5 h-8 bg-gray-300" />
                    )}
                    
                    {/* Status Icon */}
                    <View className={`w-8 h-8 rounded-full items-center justify-center mr-4 ${
                      step.isCompleted
                        ? 'bg-green-500'
                        : step.isActive
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}>
                      <Text className="text-white text-sm">{step.icon}</Text>
                    </View>
                    
                    {/* Status Content */}
                    <View className="flex-1">
                      <Text className={`text-base font-semibold ${
                        step.isCompleted || step.isActive
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}>
                        {step.title}
                      </Text>
                      <Text className={`text-sm ${
                        step.isCompleted || step.isActive
                          ? 'text-gray-700'
                          : 'text-gray-400'
                      }`}>
                        {step.description}
                      </Text>
                      {step.timestamp && (
                        <Text className="text-xs text-gray-500 mt-1">
                          {step.timestamp}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Payment Status */}
        {order.payment_status === 'pending' && (
          <View className="mb-6">
            <Card className="bg-yellow-50 border-yellow-200">
              <View className="p-4">
                <Text className="text-lg font-semibold text-yellow-900 mb-2">
                  Ödeme Bekleniyor
                </Text>
                <Text className="text-yellow-800 mb-4">
                  Siparişinizin işleme alınması için ödeme yapmanız gerekmektedir.
                </Text>
                <Button
                  title="Ödeme Yap"
                  onPress={handlePayment}
                  variant="primary"
                  className="w-full"
                />
              </View>
            </Card>
          </View>
        )}

        {/* Action Buttons */}
        <View className="mb-6 space-y-3">
          <Button
            title="Siparişlerimi Görüntüle"
            onPress={handleViewOrders}
            variant="secondary"
            className="w-full"
          />
          
          <Button
            title="Ana Sayfaya Dön"
            onPress={handleGoHome}
            variant="outline"
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
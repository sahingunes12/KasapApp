import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { Button } from '@/components';
import { ROUTES } from '@/constants';
import { RootStackParamList } from '@/types';
import { StackNavigationProp } from '@react-navigation/stack';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('Auth');
  };

  return (
    <StyledScrollView className="flex-1 bg-white">
      <StyledView className="flex-1 px-6 py-12">
        {/* Header */}
        <StyledView className="items-center mb-12">
          <StyledText className="text-4xl font-bold text-primary-600 mb-2">
            KasapApp
          </StyledText>
          <StyledText className="text-lg text-gray-600 text-center">
            Dini kurban hizmetleri için güvenilir platform
          </StyledText>
        </StyledView>

        {/* Features */}
        <StyledView className="flex-1 mb-8">
          <StyledView className="mb-8">
            <StyledView className="bg-primary-50 rounded-lg p-6 mb-4">
              <StyledText className="text-xl font-semibold text-primary-700 mb-2">
                🏠 Kişisel Hizmet
              </StyledText>
              <StyledText className="text-gray-600">
                Kurban, Adak ve Şükür hizmetlerinizi güvenle sipariş edin
              </StyledText>
            </StyledView>

            <StyledView className="bg-green-50 rounded-lg p-6 mb-4">
              <StyledText className="text-xl font-semibold text-green-700 mb-2">
                🤝 Bağış Seçenekleri
              </StyledText>
              <StyledText className="text-gray-600">
                Seçtiğiniz hayır kurumlarına bağış yapabilirsiniz
              </StyledText>
            </StyledView>

            <StyledView className="bg-blue-50 rounded-lg p-6 mb-4">
              <StyledText className="text-xl font-semibold text-blue-700 mb-2">
                📅 Randevu Sistemi
              </StyledText>
              <StyledText className="text-gray-600">
                Size uygun zamanda randevu alın
              </StyledText>
            </StyledView>

            <StyledView className="bg-purple-50 rounded-lg p-6">
              <StyledText className="text-xl font-semibold text-purple-700 mb-2">
                📱 Görsel Kanıt
              </StyledText>
              <StyledText className="text-gray-600">
                Hizmetinizin tamamlandığını fotoğraf ve video ile görün
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* CTA Button */}
        <StyledView className="mb-6">
          <Button
            title="Başlayalım"
            onPress={handleGetStarted}
            size="large"
            variant="primary"
          />
        </StyledView>

        {/* Footer */}
        <StyledView className="items-center">
          <StyledText className="text-sm text-gray-500 text-center">
            KasapApp ile dini hizmetlerinizi güvenle gerçekleştirin
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledScrollView>
  );
}; 
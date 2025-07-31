import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { styled } from 'nativewind';
import { Input, Button, Card } from '@/components';
import { AuthService } from '@/services/authService';
import { ERROR_MESSAGES } from '@/constants';
import { AuthStackParamList } from '@/types';
import { StackNavigationProp } from '@react-navigation/stack';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError(ERROR_MESSAGES.REQUIRED_FIELD);
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(ERROR_MESSAGES.INVALID_EMAIL);
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await AuthService.resetPassword(email);

      if (response.success) {
        setIsEmailSent(true);
        Alert.alert(
          'Şifre Sıfırlama',
          'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
          [{ text: 'Tamam', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        setError(response.error || 'Şifre sıfırlama başarısız.');
      }
    } catch (error) {
      setError(ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <StyledScrollView className="flex-1 bg-gray-50">
      <StyledView className="flex-1 px-6 py-8">
        {/* Header */}
        <StyledView className="items-center mb-8">
          <StyledText className="text-3xl font-bold text-primary-600 mb-2">
            Şifremi Unuttum
          </StyledText>
          <StyledText className="text-gray-600 text-center">
            E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim
          </StyledText>
        </StyledView>

        {/* Reset Password Form */}
        <Card className="mb-6">
          <Input
            label="E-posta"
            placeholder="E-posta adresinizi girin"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="mail-outline"
            error={error}
            editable={!isEmailSent}
          />

          <StyledView className="mb-6">
            <Button
              title="Şifre Sıfırlama Bağlantısı Gönder"
              onPress={handleResetPassword}
              loading={isLoading}
              disabled={isLoading || isEmailSent}
              size="large"
            />
          </StyledView>

          {isEmailSent && (
            <StyledView className="mb-4">
              <StyledText className="text-green-600 text-center">
                Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.
              </StyledText>
            </StyledView>
          )}
        </Card>

        {/* Back to Login */}
        <StyledView className="items-center">
          <Button
            title="Giriş Ekranına Dön"
            onPress={handleBackToLogin}
            variant="outline"
            size="medium"
          />
        </StyledView>
      </StyledView>
    </StyledScrollView>
  );
}; 
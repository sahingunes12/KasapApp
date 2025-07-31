import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { Input, Button, Card } from '@/components';
import { useAuthStore } from '@/stores/authStore';
import { ERROR_MESSAGES, VALIDATION } from '@/constants';
import { AuthStackParamList } from '@/types';
import { StackNavigationProp } from '@react-navigation/stack';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { signUp, isLoading, error, clearError } = useAuthStore();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName) {
      newErrors.firstName = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    if (!formData.lastName) {
      newErrors.lastName = ERROR_MESSAGES.REQUIRED_FIELD;
    }

    if (!formData.email) {
      newErrors.email = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ERROR_MESSAGES.INVALID_EMAIL;
    }

    if (!formData.password) {
      newErrors.password = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      newErrors.password = `Şifre en az ${VALIDATION.MIN_PASSWORD_LENGTH} karakter olmalıdır.`;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    clearError();
    await signUp({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || undefined,
    });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <StyledScrollView className="flex-1 bg-gray-50">
      <StyledView className="flex-1 px-6 py-8">
        {/* Header */}
        <StyledView className="items-center mb-8">
          <StyledText className="text-3xl font-bold text-primary-600 mb-2">
            Kayıt Ol
          </StyledText>
          <StyledText className="text-gray-600 text-center">
            Yeni hesap oluşturun
          </StyledText>
        </StyledView>

        {/* Register Form */}
        <Card className="mb-6">
          <Input
            label="Ad"
            placeholder="Adınızı girin"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            leftIcon="person-outline"
            error={errors.firstName}
          />

          <Input
            label="Soyad"
            placeholder="Soyadınızı girin"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            leftIcon="person-outline"
            error={errors.lastName}
          />

          <Input
            label="E-posta"
            placeholder="E-posta adresinizi girin"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon="mail-outline"
            error={errors.email}
          />

          <Input
            label="Telefon (İsteğe bağlı)"
            placeholder="Telefon numaranızı girin"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
            leftIcon="call-outline"
          />

          <Input
            label="Şifre"
            placeholder="Şifrenizi girin"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry={!showPassword}
            leftIcon="lock-closed-outline"
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword(!showPassword)}
            error={errors.password}
          />

          <Input
            label="Şifre Tekrar"
            placeholder="Şifrenizi tekrar girin"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry={!showConfirmPassword}
            leftIcon="lock-closed-outline"
            rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            error={errors.confirmPassword}
          />

          <StyledView className="mb-6">
            <Button
              title="Kayıt Ol"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              size="large"
            />
          </StyledView>

          {error && (
            <StyledView className="mb-4">
              <StyledText className="text-red-500 text-center">
                {error}
              </StyledText>
            </StyledView>
          )}
        </Card>

        {/* Login Link */}
        <StyledView className="items-center">
          <StyledText className="text-gray-600 mb-2">
            Zaten hesabınız var mı?
          </StyledText>
          <Button
            title="Giriş Yap"
            onPress={handleLogin}
            variant="secondary"
            size="medium"
          />
        </StyledView>
      </StyledView>
    </StyledScrollView>
  );
}; 
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { WebButton } from './WebButton';
import { WebCard } from './WebCard';

export const WebAuth = ({ onLogin }) => {
  const [email, setEmail] = useState('demo@kasapapp.com');
  const [password, setPassword] = useState('demo123');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setLoading(false);
      onLogin(email);
    }, 1000);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin('demo@kasapapp.com');
    }, 500);
  };

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#f9fafb',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    }}>
      <WebCard style={{ 
        width: '100%', 
        maxWidth: 400,
        padding: 32,
      }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ 
            fontSize: 32, 
            fontWeight: 'bold', 
            color: '#f2751a',
            marginBottom: 8,
          }}>
            KasapApp
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: '#6b7280',
            textAlign: 'center',
          }}>
            {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 14, 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: 8,
          }}>
            E-posta
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: 'white',
            }}
            value={email}
            onChangeText={setEmail}
            placeholder="ornek@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ 
            fontSize: 14, 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: 8,
          }}>
            Şifre
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: 'white',
            }}
            value={password}
            onChangeText={setPassword}
            placeholder="Şifrenizi girin"
            secureTextEntry
          />
        </View>

        <WebButton
          title={loading ? 'Giriş yapılıyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          onPress={handleSubmit}
          disabled={loading}
          style={{ marginBottom: 16 }}
        />

        <WebButton
          title="Demo Hesap ile Giriş"
          onPress={handleDemoLogin}
          variant="outline"
          disabled={loading}
          style={{ marginBottom: 20 }}
        />

        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          style={{ alignItems: 'center' }}
        >
          <Text style={{ color: '#f2751a', fontSize: 14 }}>
            {isLogin 
              ? 'Hesabınız yok mu? Kayıt olun' 
              : 'Zaten hesabınız var mı? Giriş yapın'
            }
          </Text>
        </TouchableOpacity>

        <View style={{ 
          marginTop: 24, 
          padding: 16, 
          backgroundColor: '#fef3c7',
          borderRadius: 8,
        }}>
          <Text style={{ 
            fontSize: 12, 
            color: '#92400e',
            textAlign: 'center',
            lineHeight: 16,
          }}>
            ℹ️ Demo Hesap Bilgileri{'\n'}
            E-posta: demo@kasapapp.com{'\n'}
            Şifre: demo123
          </Text>
        </View>
      </WebCard>
    </View>
  );
};
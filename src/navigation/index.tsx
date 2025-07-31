import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { Loading } from '@/components';
import { 
  WelcomeScreen, 
  LoginScreen, 
  RegisterScreen, 
  ForgotPasswordScreen,
  HomeScreen,
  OrderDetailsScreen,
  OrderConfirmationScreen
} from '@/screens';
import { DrawerNavigator } from './DrawerNavigator';
import { ROUTES } from '@/constants';
import { RootStackParamList, MainTabParamList, AuthStackParamList } from '@/types';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

// Auth Stack Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'help-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Media') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f2751a',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Ana Sayfa',
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={() => <Loading text="Siparişler yükleniyor..." fullScreen />} 
        options={{
          title: 'Siparişler',
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={() => <Loading text="Takvim yükleniyor..." fullScreen />} 
        options={{
          title: 'Takvim',
        }}
      />
      <Tab.Screen 
        name="Media" 
        component={() => <Loading text="Medya yükleniyor..." fullScreen />} 
        options={{
          title: 'Medya',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={() => <Loading text="Profil yükleniyor..." fullScreen />} 
        options={{
          title: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator
export const AppNavigator = () => {
  const { isAuthenticated, isLoading, getCurrentUser } = useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  if (isLoading) {
    return <Loading text="Uygulama yükleniyor..." fullScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={DrawerNavigator} />
            <Stack.Screen 
              name="OrderDetails" 
              component={OrderDetailsScreen}
              options={{
                headerShown: true,
                title: 'Sipariş Detayları',
                headerTintColor: '#f2751a',
              }}
            />
            <Stack.Screen 
              name="OrderConfirmation" 
              component={OrderConfirmationScreen}
              options={{
                headerShown: true,
                title: 'Sipariş Onayı',
                headerTintColor: '#f2751a',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Loading } from '@/components';
import { HomeScreen, CalendarScreen } from '@/screens';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerIcon: ({ focused, color, size }) => {
          let iconName;

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
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Help') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        drawerActiveTintColor: '#f2751a',
        drawerInactiveTintColor: 'gray',
        headerTintColor: '#f2751a',
        headerStyle: {
          backgroundColor: '#f2751a',
        },
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
      })}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Ana Sayfa',
          drawerLabel: 'Ana Sayfa',
        }}
      />
      <Drawer.Screen 
        name="Orders" 
        component={() => <Loading text="Siparişler yükleniyor..." fullScreen />} 
        options={{
          title: 'Siparişlerim',
          drawerLabel: 'Siparişlerim',
        }}
      />
      <Drawer.Screen 
        name="Calendar" 
        component={CalendarScreen} 
        options={{
          title: 'Takvim',
          drawerLabel: 'Takvim',
        }}
      />
      <Drawer.Screen 
        name="Media" 
        component={() => <Loading text="Medya yükleniyor..." fullScreen />} 
        options={{
          title: 'Medya',
          drawerLabel: 'Medya',
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={() => <Loading text="Profil yükleniyor..." fullScreen />} 
        options={{
          title: 'Profil',
          drawerLabel: 'Profil',
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={() => <Loading text="Ayarlar yükleniyor..." fullScreen />} 
        options={{
          title: 'Ayarlar',
          drawerLabel: 'Ayarlar',
        }}
      />
      <Drawer.Screen 
        name="Help" 
        component={() => <Loading text="Yardım yükleniyor..." fullScreen />} 
        options={{
          title: 'Yardım',
          drawerLabel: 'Yardım',
        }}
      />
    </Drawer.Navigator>
  );
}; 
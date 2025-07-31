import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export const WebLoading = ({ text = 'Yükleniyor...', size = 'large', color = '#f2751a', fullScreen = false }) => {
  const containerStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: fullScreen ? 'white' : 'transparent',
    position: fullScreen ? 'absolute' : 'relative',
    top: fullScreen ? 0 : undefined,
    left: fullScreen ? 0 : undefined,
    right: fullScreen ? 0 : undefined,
    bottom: fullScreen ? 0 : undefined,
    zIndex: fullScreen ? 999 : undefined,
  };

  const textStyle = {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  };

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={color} />
      <Text style={textStyle}>{text}</Text>
    </View>
  );
}; 
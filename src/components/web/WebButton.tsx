import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

export const WebButton = ({ title, onPress, variant = 'primary', disabled = false, style = {} }) => {
  const getButtonStyle = () => {
    const baseStyle = {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    };

    const variantStyles = {
      primary: {
        backgroundColor: '#f2751a',
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#f2751a',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#e5e7eb',
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      opacity: disabled ? 0.5 : 1,
      ...style,
    };
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    };

    const variantTextStyles = {
      primary: {
        color: 'white',
      },
      secondary: {
        color: '#f2751a',
      },
      outline: {
        color: '#374151',
      },
    };

    return {
      ...baseTextStyle,
      ...variantTextStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
}; 
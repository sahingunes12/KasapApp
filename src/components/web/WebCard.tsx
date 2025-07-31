import React from 'react';
import { View, Text } from 'react-native';

export const WebCard = ({ children, variant = 'default', style = {} }) => {
  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    };

    const variantStyles = {
      default: {
        borderWidth: 0,
      },
      elevated: {
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation: 10,
      },
      outlined: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowOpacity: 0,
        elevation: 0,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...style,
    };
  };

  return <View style={getCardStyle()}>{children}</View>;
}; 
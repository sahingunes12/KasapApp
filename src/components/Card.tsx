import React from 'react';
import { View, ViewProps } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  style,
  ...props
}) => {
  const getCardClasses = () => {
    const baseClasses = 'rounded-lg bg-white';
    
    const variantClasses = {
      default: 'shadow-sm',
      elevated: 'shadow-lg',
      outlined: 'border border-gray-200',
    };
    
    const paddingClasses = {
      none: '',
      small: 'p-3',
      medium: 'p-4',
      large: 'p-6',
    };
    
    return `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]}`;
  };

  return (
    <StyledView className={getCardClasses()} style={style} {...props}>
      {children}
    </StyledView>
  );
}; 
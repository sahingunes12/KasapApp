import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'rounded-lg flex-row items-center justify-center';
    
    const variantClasses = {
      primary: 'bg-primary-500',
      secondary: 'bg-secondary-500',
      outline: 'bg-transparent border border-primary-500',
      danger: 'bg-red-500',
    };
    
    const sizeClasses = {
      small: 'px-4 py-2',
      medium: 'px-6 py-3',
      large: 'px-8 py-4',
    };
    
    const disabledClasses = disabled ? 'opacity-50' : '';
    
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses}`;
  };

  const getTextClasses = () => {
    const baseClasses = 'font-semibold text-center';
    
    const variantClasses = {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-primary-500',
      danger: 'text-white',
    };
    
    const sizeClasses = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };
    
    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
  };

  return (
    <StyledTouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? '#f2751a' : '#ffffff'} 
        />
      ) : (
        <StyledText className={getTextClasses()} style={textStyle}>
          {title}
        </StyledText>
      )}
    </StyledTouchableOpacity>
  );
}; 
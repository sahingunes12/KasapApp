import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getInputContainerClasses = () => {
    const baseClasses = 'border rounded-lg flex-row items-center px-3';
    const focusClasses = isFocused ? 'border-primary-500' : 'border-gray-300';
    const errorClasses = error ? 'border-red-500' : '';
    
    return `${baseClasses} ${focusClasses} ${errorClasses}`;
  };

  const getInputClasses = () => {
    const baseClasses = 'flex-1 py-3 text-base';
    const iconPadding = leftIcon ? 'pl-2' : '';
    
    return `${baseClasses} ${iconPadding}`;
  };

  return (
    <StyledView className="mb-4" style={containerStyle}>
      {label && (
        <StyledText className="text-sm font-medium text-gray-700 mb-2">
          {label}
        </StyledText>
      )}
      
      <StyledView className={getInputContainerClasses()}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={20} 
            color={isFocused ? '#f2751a' : '#6b7280'} 
            style={{ marginRight: 8 }}
          />
        )}
        
        <StyledTextInput
          className={getInputClasses()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9ca3af"
          style={style}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            <Ionicons 
              name={rightIcon} 
              size={20} 
              color={isFocused ? '#f2751a' : '#6b7280'} 
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        )}
      </StyledView>
      
      {error && (
        <StyledText className="text-sm text-red-500 mt-1">
          {error}
        </StyledText>
      )}
    </StyledView>
  );
}; 
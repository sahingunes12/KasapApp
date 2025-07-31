import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = '#f2751a',
  text,
  fullScreen = false,
}) => {
  const containerClasses = fullScreen 
    ? 'flex-1 justify-center items-center bg-white' 
    : 'justify-center items-center py-8';

  return (
    <StyledView className={containerClasses}>
      <ActivityIndicator size={size} color={color} />
      {text && (
        <StyledText className="text-gray-600 mt-4 text-center">
          {text}
        </StyledText>
      )}
    </StyledView>
  );
}; 
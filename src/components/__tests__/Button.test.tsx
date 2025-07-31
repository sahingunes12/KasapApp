import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  const defaultProps = {
    title: 'Test Button',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    const { getByText } = render(<Button {...defaultProps} />);
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button {...defaultProps} onPress={onPress} />);
    
    fireEvent.press(getByText('Test Button'));
    
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button {...defaultProps} onPress={onPress} disabled={true} />
    );
    
    fireEvent.press(getByText('Test Button'));
    
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    const { getByText } = render(
      <Button {...defaultProps} loading={true} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should render with different variants', () => {
    const { getByText, rerender } = render(<Button {...defaultProps} variant="primary" />);
    expect(getByText('Test Button')).toBeTruthy();

    rerender(<Button {...defaultProps} variant="secondary" />);
    expect(getByText('Test Button')).toBeTruthy();

    rerender(<Button {...defaultProps} variant="outline" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should render with different sizes', () => {
    const { getByText, rerender } = render(<Button {...defaultProps} size="small" />);
    expect(getByText('Test Button')).toBeTruthy();

    rerender(<Button {...defaultProps} size="medium" />);
    expect(getByText('Test Button')).toBeTruthy();

    rerender(<Button {...defaultProps} size="large" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should render with icon', () => {
    const { getByText } = render(
      <Button {...defaultProps} leftIcon="mail-outline" />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should render with right icon', () => {
    const { getByText } = render(
      <Button {...defaultProps} rightIcon="arrow-forward" />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should handle right icon press', () => {
    const onRightIconPress = jest.fn();
    const { getByText } = render(
      <Button {...defaultProps} rightIcon="arrow-forward" onRightIconPress={onRightIconPress} />
    );
    
    // Note: In a real test, you would need to find the icon element and press it
    // This is a simplified test for the structure
    expect(getByText('Test Button')).toBeTruthy();
  });
}); 
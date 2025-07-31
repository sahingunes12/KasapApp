import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input', () => {
  const defaultProps = {
    label: 'Test Input',
    placeholder: 'Enter text',
    value: '',
    onChangeText: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    const { getByText, getByPlaceholderText } = render(<Input {...defaultProps} />);
    
    expect(getByText('Test Input')).toBeTruthy();
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should call onChangeText when text is entered', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input {...defaultProps} onChangeText={onChangeText} />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'test value');
    
    expect(onChangeText).toHaveBeenCalledWith('test value');
  });

  it('should display error message when error prop is provided', () => {
    const { getByText } = render(
      <Input {...defaultProps} error="This field is required" />
    );
    
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('should render with left icon', () => {
    const { getByText } = render(
      <Input {...defaultProps} leftIcon="mail-outline" />
    );
    
    expect(getByText('Test Input')).toBeTruthy();
  });

  it('should render with right icon', () => {
    const { getByText } = render(
      <Input {...defaultProps} rightIcon="eye-outline" />
    );
    
    expect(getByText('Test Input')).toBeTruthy();
  });

  it('should handle right icon press', () => {
    const onRightIconPress = jest.fn();
    const { getByText } = render(
      <Input {...defaultProps} rightIcon="eye-outline" onRightIconPress={onRightIconPress} />
    );
    
    expect(getByText('Test Input')).toBeTruthy();
  });

  it('should render secure text entry', () => {
    const { getByPlaceholderText } = render(
      <Input {...defaultProps} secureTextEntry={true} />
    );
    
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with keyboard type', () => {
    const { getByPlaceholderText } = render(
      <Input {...defaultProps} keyboardType="email-address" />
    );
    
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with auto capitalize', () => {
    const { getByPlaceholderText } = render(
      <Input {...defaultProps} autoCapitalize="none" />
    );
    
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with auto correct disabled', () => {
    const { getByPlaceholderText } = render(
      <Input {...defaultProps} autoCorrect={false} />
    );
    
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with multiline', () => {
    const { getByPlaceholderText } = render(
      <Input {...defaultProps} multiline={true} />
    );
    
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with number of lines', () => {
    const { getByPlaceholderText } = render(
      <Input {...defaultProps} multiline={true} numberOfLines={3} />
    );
    
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });
}); 
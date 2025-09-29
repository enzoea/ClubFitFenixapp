import type { TextInputProps } from 'react-native';
import type { StyleProp } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

export interface InputFieldProps extends TextInputProps {
  label?: string;
  secure?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
  placeholderTextColor?: string;
}
import type { StyleProp } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';

export interface ButtonSecondaryProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  width?: number | string;
}
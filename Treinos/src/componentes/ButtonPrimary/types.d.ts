import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface ButtonPrimaryProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  disabled?: boolean;
  width?: number | string;
}
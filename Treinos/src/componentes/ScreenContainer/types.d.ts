import type { ReactNode } from 'react';
import type { StyleProp } from 'react-native';
import type { ViewStyle } from 'react-native';

export interface ScreenContainerProps {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  keyboardOffset?: number;
  centered?: boolean;
}
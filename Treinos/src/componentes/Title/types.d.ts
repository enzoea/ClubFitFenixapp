import type { ReactNode } from 'react';
import type { StyleProp } from 'react-native';
import type { TextStyle } from 'react-native';

export interface TitleProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  align?: 'left' | 'center' | 'right';
}
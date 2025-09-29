// React
import React from 'react';

// React Native
import { Text } from 'react-native';

// Estilos
import { styles } from './styles';

// Tipos
import type { TitleProps } from './types';

const Title: React.FC<TitleProps> = ({ children, style, align = 'center' }) => {
  return <Text style={[styles.title, { textAlign: align }, style]}>{children}</Text>;
};

export default Title;
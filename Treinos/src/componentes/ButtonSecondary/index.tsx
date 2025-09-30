// React
import React from 'react';

// React Native
import { TouchableOpacity, Text } from 'react-native';

// Estilos
import { styles } from './styles';

// Tipos
import type { ButtonSecondaryProps } from './types';

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({ title, style, textStyle, onPress, disabled, width }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { width: width ?? 300, alignSelf: 'center' }, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonSecondary;
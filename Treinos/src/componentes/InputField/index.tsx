// React
import React from 'react';

// React Native
import { View, Text, TextInput } from 'react-native';

// Tipos
import type { InputFieldProps } from './types';

// Estilos
import { styles } from './styles';

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secure = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  containerStyle,
  placeholderTextColor = '#febc02',
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        {...rest}
      />
    </View>
  );
};

export default InputField;
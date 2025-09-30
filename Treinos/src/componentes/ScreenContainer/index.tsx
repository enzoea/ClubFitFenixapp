// React
import React from 'react';

// React Native
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

// Estilos
import { styles } from './styles';

// Tipos
import type { ScreenContainerProps } from './types';

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  contentContainerStyle,
  style,
  keyboardOffset = 0,
  centered = false,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardOffset}
      style={[styles.root, style]}
    >
      <ScrollView
        contentContainerStyle={[styles.content, centered && styles.centered, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ScreenContainer;
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import type { EmptyStateProps } from './types';

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default EmptyState;
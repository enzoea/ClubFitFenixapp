import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../utils/theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
  },
});
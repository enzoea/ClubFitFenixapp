import { StyleSheet } from 'react-native';
import { colors, spacing, radii } from '../../utils/theme';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.sm,
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  text: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
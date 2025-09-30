import { StyleSheet } from 'react-native';
import { colors, spacing, radii } from '../../utils/theme';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.sm,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  text: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});
import { StyleSheet } from 'react-native';
import { colors, spacing, radii } from '../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginVertical: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});
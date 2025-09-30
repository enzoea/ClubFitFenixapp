import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../utils/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  nome: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
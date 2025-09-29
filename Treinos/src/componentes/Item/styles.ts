import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../utils/theme';

export const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDiv: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: colors.mutedBorder,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.md,
  },
  imagem: {
    width: 46,
    height: 46,
    marginLeft: spacing.lg,
  },
  nome: {
    fontSize: 16,
    lineHeight: 26,
    marginLeft: spacing.sm,
    color: colors.textSecondary,
  },
  descricao: {
    fontSize: 12,
    lineHeight: 26,
    marginLeft: spacing.sm,
    color: colors.textSecondary,
  },
});
import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../utils/theme';

export const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, padding: spacing.lg, alignItems: 'center' },
  menu: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  menuIconContainer: { marginRight: spacing.sm },
  menuIcon: { fontSize: 24, color: colors.primary, fontWeight: 'bold' },
  nomeClub: { color: colors.primary, fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  fotoContainer: { marginLeft: spacing.sm },
  fotoPerfil: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.primary },
});
import { StyleSheet } from 'react-native';
import { colors, spacing, radii } from '../../utils/theme';

export const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { fontSize: 16, color: '#febc02', marginBottom: 10, textAlign: 'left' },
  input: {
    borderWidth: 1,
    borderColor: '#febc02',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 5,
    marginBottom: 15,
    width: 300,
    color: '#ffffff',
    textAlign: 'center',
    alignSelf: 'center',
  },
});
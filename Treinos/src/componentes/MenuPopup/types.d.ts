import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../BarraMenu/types';

export interface MenuPopupProps {
  visible: boolean;
  onClose: () => void;
  navigation: NavigationProp<RootStackParamList>;
  onLogout: () => void;
}
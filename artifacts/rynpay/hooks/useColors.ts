import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';

export function useColors() {
  // Currently only light mode is fully designed; extend for dark when needed
  return colors.light;
}

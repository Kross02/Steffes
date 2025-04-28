import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleProp, ViewStyle } from 'react-native';

// Define your icon names
export type IconName = 
  | 'home'
  | 'send'
  | 'person'
  | 'inventory'
  | 'approval'
  | 'search';
  

export function IconSymbol({
  name,
  size = 24,
  color = "#d51f2b",
  weight,
  style,
}: {
  name: IconName;
  size?: number;
  color: string;
  weight?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return <MaterialIcons name={name} size={size} color={color} weight={weight} />;
}
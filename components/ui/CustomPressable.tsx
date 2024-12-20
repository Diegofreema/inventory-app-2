/* eslint-disable prettier/prettier */

import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export const CustomPressable = ({ children, onPress, style }: Props): JSX.Element => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[{ padding: 5, flex: 0 }, style]}>
      {children}
    </TouchableOpacity>
  );
};

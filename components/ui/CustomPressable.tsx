/* eslint-disable prettier/prettier */

import { Pressable, StyleProp, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export const CustomPressable = ({ children, onPress, style }: Props): JSX.Element => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, flex: 1 }, style]}>
      {children}
    </Pressable>
  );
};

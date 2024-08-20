/* eslint-disable prettier/prettier */

import { LinearGradient } from 'expo-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

type Props = {
  loading: boolean;
  children: React.ReactNode;
  style?: any;
};

export const Skeleton = ({ children, loading, style }: Props): JSX.Element => {
  return (
    <ShimmerPlaceHolder
      visible={!loading}
      contentStyle={{ flex: 1 }}
      style={[{ borderWith: 0 }, style]}
      LinearGradient={LinearGradient}>
      {children}
    </ShimmerPlaceHolder>
  );
};

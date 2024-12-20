import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '~/constants';
import { useNetwork } from '~/hooks/useNetwork';
import { theme } from '~/theme';

const minHeight = 0;

export function OfflineBanner() {
  const isConnected = useNetwork();
  const insets = useSafeAreaInsets();
  const height = useSharedValue(0);

  const maxHeight = 28 + insets.bottom / 2;

  useEffect(() => {
    if (!isConnected) {
      height.value = withTiming(maxHeight);
    } else {
      height.value = withTiming(minHeight);
    }
  }, [isConnected, height, maxHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    marginTop: interpolate(
      height.value,
      [minHeight, maxHeight],
      [minHeight, -insets.bottom + theme.space4]
    ),
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.container}>
        <Text style={styles.text}>App is offline</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: colors.green,
  },
  text: { fontSize: 20, fontFamily: 'InterBold', textAlign: 'center', color: colors.white },
});

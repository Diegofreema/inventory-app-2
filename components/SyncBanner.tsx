import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spinner } from 'tamagui';

import { MyButton } from '~/components/ui/MyButton';
import { colors } from '~/constants';
import { useNetwork } from '~/hooks/useNetwork';
import { useUpload } from '~/lib/tanstack/mutations';
import { theme } from '~/theme';

const minHeight = 0;

export function SyncBanner() {
  const isConnected = useNetwork();
  const { mutateAsync, isPending } = useUpload();
  console.log(isConnected);
  const insets = useSafeAreaInsets();
  const height = useSharedValue(0);

  const maxHeight = 50 + insets.bottom / 2;
  const onSync = async () => {
    await mutateAsync();
  };
  useEffect(() => {
    if (isConnected) {
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
  const text = isPending
    ? "Data syncing don't turn off your internet" + ' connection'
    : `App is back online`;

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.container}>
        <Text style={styles.text}>{text}</Text>
        {isPending ? (
          <Spinner color={colors.white} size="small" />
        ) : (
          <MyButton
            title="Sync data"
            onPress={onSync}
            buttonStyle={{ backgroundColor: colors.white }}
            color={colors.green}
            backgroundColor={colors.white}
          />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: colors.green,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: RFPercentage(1.7),
    fontFamily: 'InterBold',
    textAlign: 'center',
    color: colors.white,
    maxWidth: 200
  },
});

/* eslint-disable prettier/prettier */
import { LinearGradient } from 'expo-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { Spinner, Stack, View } from 'tamagui';

import { colors } from '../../constants';

export const Loading = (): JSX.Element => {
  return (
    <View flex={1} bg="white" justifyContent="center" alignItems="center">
      <Spinner size="large" color={colors.green} />
    </View>
  );
};

export const ProductLoader = () => {
  return (
    <Stack gap={10} mt={20}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={{ height: 200, borderRadius: 10, width: '100%' }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={{ height: 200, borderRadius: 10, width: '100%' }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={{ height: 200, borderRadius: 10, width: '100%' }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={{ height: 200, borderRadius: 10, width: '100%' }}
      />
    </Stack>
  );
};
export const Loader = () => {
  return (
    <Stack gap={10} mt={20}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={{ height: 400, borderRadius: 10, width: '100%' }}
      />
    </Stack>
  );
};

export const ChartLoader = ({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) => {
  return (
    <ShimmerPlaceHolder
      LinearGradient={LinearGradient}
      visible={!loading}
      style={{ height: 320, borderRadius: 10, width: '100%', marginTop: 15 }}>
      {children}
    </ShimmerPlaceHolder>
  );
};
export const ExpenditureLoader = () => {
  return (
    <Stack gap={10}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        visible={false}
        style={{ height: 150, borderRadius: 10, width: '100%', marginTop: 15 }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        visible={false}
        style={{ height: 150, borderRadius: 10, width: '100%', marginTop: 15 }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        visible={false}
        style={{ height: 150, borderRadius: 10, width: '100%', marginTop: 15 }}
      />
    </Stack>
  );
};
export const ExpenseLoader = () => {
  return (
    <Stack gap={10}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        visible={false}
        style={{ height: 200, borderRadius: 10, width: '100%', marginTop: 15 }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        visible={false}
        style={{ height: 200, borderRadius: 10, width: '100%', marginTop: 15 }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        visible={false}
        style={{ height: 200, borderRadius: 10, width: '100%', marginTop: 15 }}
      />
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        visible={false}
        style={{ height: 200, borderRadius: 10, width: '100%', marginTop: 15 }}
      />
    </Stack>
  );
};
export const FormLoader = () => {
  return (
    <Stack gap={10} px="$4" bg="white">
      <Stack gap={3}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 15, borderRadius: 5, width: 60, marginTop: 15 }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 50, borderRadius: 10, width: '100%', marginTop: 15 }}
        />
      </Stack>
      <Stack gap={3}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 15, borderRadius: 5, width: 50, marginTop: 15 }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 50, borderRadius: 10, width: '100%', marginTop: 15 }}
        />
      </Stack>
      <Stack gap={3}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 15, borderRadius: 5, width: 50, marginTop: 15 }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 50, borderRadius: 10, width: '100%', marginTop: 15 }}
        />
      </Stack>
      <Stack gap={3}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 15, borderRadius: 5, width: 50, marginTop: 15 }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 50, borderRadius: 10, width: '100%', marginTop: 15 }}
        />
      </Stack>
      <Stack gap={3}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 15, borderRadius: 5, width: 50, marginTop: 15 }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 50, borderRadius: 10, width: '100%', marginTop: 15 }}
        />
      </Stack>
      <Stack gap={3}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 15, borderRadius: 5, width: 50, marginTop: 15 }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 50, borderRadius: 10, width: '100%', marginTop: 15 }}
        />
      </Stack>
      <Stack gap={3}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 15, borderRadius: 5, width: 50, marginTop: 15 }}
        />
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          visible={false}
          style={{ height: 50, borderRadius: 10, width: '100%', marginTop: 15 }}
        />
      </Stack>
    </Stack>
  );
};

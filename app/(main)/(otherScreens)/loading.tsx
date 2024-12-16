/* eslint-disable prettier/prettier */

import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { View } from 'tamagui';

import { Error } from '~/components/ui/Error';
import { colors } from '~/constants';
import { useFetchAll } from '~/lib/tanstack/queries';

export default function LoadingDataScreen() {
  const { error, fetchAll, fetching } = useFetchAll();


  const router = useRouter();
  const handleRefetch = () => {
    fetchAll();
  };
  useEffect(() => {
    if (!fetching && !error) {
      router.replace('/')
    }
  }, [fetching, error]);
  if (error?.trim())
    return <Error onRetry={handleRefetch} text={error} />;
  return (
    <View flex={1} justifyContent="center" alignItems="center" bg="white">
      <ActivityIndicator size="large" color={colors.green} />
    </View>
  );
}

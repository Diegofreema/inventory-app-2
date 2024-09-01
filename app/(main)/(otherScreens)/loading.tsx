/* eslint-disable prettier/prettier */

import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { Container } from '~/components/Container';
import { Error } from '~/components/ui/Error';
import { ProductLoader, SquareLoader } from '~/components/ui/Loading';
import { useFetchAll } from '~/lib/tanstack/queries';

export default function LoadingDataScreen() {
  const { error, fetchAll, fetching } = useFetchAll();
  console.log('loading screen');

  const router = useRouter();
  const handleRefetch = () => {
    fetchAll();
  };
  useEffect(() => {
    if (!fetching && !error) router.replace('/');
  }, [fetching, error]);
  if (error === 'No internet connection, Internet connection needed to sync data')
    return <Error onRetry={handleRefetch} text={error} />;
  return (
    <Container paddingHorizontal="$4">
      <SquareLoader />
      <ProductLoader />
    </Container>
  );
}

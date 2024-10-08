/* eslint-disable prettier/prettier */

import { useEffect, useMemo } from 'react';

import { Container } from '~/components/Container';
import { Notifications } from '~/components/Notifications';
import { Error } from '~/components/ui/Error';
import { ProductLoader } from '~/components/ui/Loading';
import { NavHeader } from '~/components/ui/NavHeader';
import { useNotify } from '~/lib/tanstack/queries';
import { useRead } from '~/lib/zustand/useRead';

const Notification = (): JSX.Element => {
  const setRead = useRead((state) => state.setRead);
  const { data, isError, isPending, isRefetching, isRefetchError, refetch } = useNotify();
  const onRefetching = useMemo(() => isRefetching, [isRefetching]);
  const onRefetch = useMemo(() => refetch, []);
  useEffect(() => {
    setRead();
  }, []);
  if (isError || isRefetchError) return <Error onRetry={refetch} />;

  return (
    <Container>
      <NavHeader title="Notification" />
      {isPending ? (
        <ProductLoader />
      ) : (
        <Notifications data={data} isLoading={onRefetching} onRefetch={onRefetch} />
      )}
    </Container>
  );
};

export default Notification;

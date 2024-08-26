/* eslint-disable prettier/prettier */
// import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
// import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';
import { RefreshControl } from 'react-native';
import { ScrollView, XStack } from 'tamagui';

import { Container } from '~/components/Container';
import { LogoutButton } from '~/components/LogoutButton';
import { DashBoardCards } from '~/components/home/DashBoardCards';
import { Error } from '~/components/ui/Error';
import { ProductLoader } from '~/components/ui/Loading';
import { Products } from '~/components/ui/Products';
import { CustomHeading } from '~/components/ui/typography';
// import * as schema from '~/db/schema';
import { useProducts, useSalesP, useSalesS } from '~/lib/tanstack/queries';

export default function Home() {
  // const database = useSQLiteContext();
  // const db = drizzle(database, { schema });
  // const { data } = useLiveQuery(db.select().from(schema.product));
  // console.log(data);

  const {
    data,
    isError,
    isPending,
    refetch,
    isRefetching: isRefetchingProduct,
    error,
  } = useProducts();
  console.log(error);

  const {
    data: dataP,
    isError: isErrorP,
    isPending: isPendingP,
    refetch: refetchP,
    isRefetching,
  } = useSalesP();
  const {
    data: dataS,
    isError: isErrorS,
    isPending: isPendingS,
    refetch: refetchS,

    isRefetching: isRefetchingP,
  } = useSalesS();
  const isReloading = isRefetching || isRefetchingP || isRefetchingProduct;

  const limitedProducts = useMemo(() => data?.slice(0, 5), [data]);
  const products = useMemo(() => data, [data]);
  const isLoading = useMemo(() => isPendingP || isPendingS, [isPendingP, isPendingS]);

  const storeSales = useMemo(() => dataS, [dataS]);
  const pharmacySales = useMemo(() => dataP, [dataP]);
  const handleRefetch = () => {
    refetch();
    refetchP();
    refetchS();
  };
  if (isError || isErrorP || isErrorS) {
    return <Error onRetry={handleRefetch} />;
  }

  return (
    <Container>
      <XStack justifyContent="space-between" alignItems="center">
        <CustomHeading text="Dashboard" fontSize={15} />
        <LogoutButton />
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={handleRefetch} refreshing={isReloading} />}>
        <DashBoardCards
          loading={isLoading}
          products={products}
          salesP={pharmacySales}
          salesS={storeSales}
        />
        {/* <ChartLoader loading={loading}>
          <Chart label="Expense" data={expense} />
        </ChartLoader> */}
        {isPending ? (
          <ProductLoader />
        ) : (
          <Products
            data={limitedProducts}
            text="Product list"
            linkText="View Product Page"
            href="/store"
          />
        )}
      </ScrollView>
    </Container>
  );
}

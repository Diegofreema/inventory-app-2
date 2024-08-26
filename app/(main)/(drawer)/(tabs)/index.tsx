/* eslint-disable prettier/prettier */
// import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
// import { useSQLiteContext } from 'expo-sqlite';
import { eq } from 'drizzle-orm';
import { useMemo } from 'react';
import { RefreshControl } from 'react-native';
import { ScrollView, XStack } from 'tamagui';

import { Container } from '~/components/Container';
import { LogoutButton } from '~/components/LogoutButton';
import { DashBoardCards } from '~/components/home/DashBoardCards';
import { Error } from '~/components/ui/Error';
import { ProductLoader } from '~/components/ui/Loading';
import { MyButton } from '~/components/ui/MyButton';
import { Products } from '~/components/ui/Products';
import { CustomHeading } from '~/components/ui/typography';
import { useDrizzle } from '~/hooks/useDrizzle';
import { useGet } from '~/hooks/useGet';
// import * as schema from '~/db/schema';
import { useProducts, useSalesP, useSalesS } from '~/lib/tanstack/queries';

export default function Home() {
  const { db, schema } = useDrizzle();
  const { onlineSales, products, storeSales } = useGet();
  const { isError, isPending, refetch, isRefetching: isRefetchingProduct } = useProducts();

  const { isError: isErrorP, isPending: isPendingP, refetch: refetchP, isRefetching } = useSalesP();

  const {
    isError: isErrorS,
    isPending: isPendingS,
    refetch: refetchS,

    isRefetching: isRefetchingP,
  } = useSalesS();
  const isReloading = isRefetching || isRefetchingP || isRefetchingProduct;

  const limitedProducts = useMemo(() => products?.slice(0, 5), [products]);

  const isLoading = useMemo(() => isPendingP || isPendingS, [isPendingP, isPendingS]);

  const handleRefetch = () => {
    refetch();
    refetchP();
    refetchS();
  };

  const onDelete = () => {
    storeSales.forEach(async (d) => {
      await db.delete(schema.StoreSales).where(eq(schema.StoreSales.id, d.id!));
    });
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
      <MyButton title="Refresh" onPress={onDelete} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={handleRefetch} refreshing={isReloading} />}>
        <DashBoardCards
          loading={isLoading}
          products={products}
          salesP={onlineSales}
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

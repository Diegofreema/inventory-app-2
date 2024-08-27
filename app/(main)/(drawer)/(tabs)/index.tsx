/* eslint-disable prettier/prettier */

import { useMemo } from 'react';
import { RefreshControl } from 'react-native';
import { ScrollView, XStack } from 'tamagui';

import { Container } from '~/components/Container';
import { LogoutButton } from '~/components/LogoutButton';
import { DashBoardCards } from '~/components/home/DashBoardCards';
import { ErrorBanner } from '~/components/ui/ErrorBanner';
import { ProductLoader } from '~/components/ui/Loading';
import { Products } from '~/components/ui/Products';
import { CustomHeading } from '~/components/ui/typography';
import { useGet } from '~/hooks/useGet';
import { useProducts, useSalesP, useSalesS } from '~/lib/tanstack/queries';

export default function Home() {
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

  const limitedProducts = useMemo(() => {
    if (!products) return [];
    return products.slice(0, 5);
  }, [products]);

  const isLoading = useMemo(() => isPendingP || isPendingS, [isPendingP, isPendingS]);

  const handleRefetch = () => {
    refetch();
    refetchP();
    refetchS();
  };

  const error = isError || isErrorP || isErrorS;

  return (
    <Container>
      {error && <ErrorBanner />}
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

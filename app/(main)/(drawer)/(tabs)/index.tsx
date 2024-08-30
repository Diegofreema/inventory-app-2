/* eslint-disable prettier/prettier */

import { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, XStack } from 'tamagui';

import { Container } from '~/components/Container';
import { LogoutButton } from '~/components/LogoutButton';
import { DashBoardCards } from '~/components/home/DashBoardCards';
import { Error } from '~/components/ui/Error';
import { ProductLoader } from '~/components/ui/Loading';
// import { MyButton } from '~/components/ui/MyButton';
import { Products } from '~/components/ui/Products';
import { CustomHeading } from '~/components/ui/typography';
// import { useDrizzle } from '~/hooks/useDrizzle';
import { getSupply } from '~/lib/helper';
import { useProducts, useSalesP, useSalesS } from '~/lib/tanstack/queries';
import { useStore } from '~/lib/zustand/useStore';

export default function Home() {
  const {
    data: products,
    isError: isErrorProducts,
    isPending: isPendingProducts,
    refetch,
  } = useProducts();
  const {
    data: onlineSales,
    isError: isErrorOnline,
    isPending: isPendingOnline,
    refetch: refetchOnline,
  } = useSalesP();
  const {
    data: storeSales,
    isError: isErrorStore,
    isPending: isPendingStore,
    refetch: refetchStore,
  } = useSalesS();
  const id = useStore((state) => state.id);
  // const { db, schema } = useDrizzle();
  const limitedProducts = useMemo(() => {
    if (!products) return [];
    return products.slice(0, 5);
  }, [products]);
  useEffect(() => {
    const fetchData = async () => {
      const dt = await getSupply(id);
      console.log('🚀 ~ fetchData ~ dt:', dt);
    };

    fetchData();
  }, []);
  const handleError = useCallback(() => {
    refetch();
    refetchOnline();
    refetchStore();
  }, []);
  console.log('🚀 ~ Home ~ products:', products?.length);
  if (isErrorOnline || isErrorProducts || isErrorStore) return <Error onRetry={handleError} />;
  if (isPendingOnline || isPendingProducts || isPendingStore) return <ProductLoader />;
  return (
    <Container>
      <XStack justifyContent="space-between" alignItems="center">
        <CustomHeading text="Dashboard" fontSize={15} />
        <LogoutButton />
      </XStack>
      {/* <MyButton title="btn" onPress={createCart} /> */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <DashBoardCards products={products} salesP={onlineSales} salesS={storeSales} />
        <Products
          data={limitedProducts}
          text="Product list"
          linkText="View Product Page"
          href="/store"
          navigate
        />
      </ScrollView>
    </Container>
  );
}

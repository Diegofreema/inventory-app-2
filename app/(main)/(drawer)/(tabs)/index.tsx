/* eslint-disable prettier/prettier */

import { useEffect, useMemo } from 'react';
import { ScrollView, XStack } from 'tamagui';

import { Container } from '~/components/Container';
import { LogoutButton } from '~/components/LogoutButton';
import { DashBoardCards } from '~/components/home/DashBoardCards';
// import { MyButton } from '~/components/ui/MyButton';
import { Products } from '~/components/ui/Products';
import { CustomHeading } from '~/components/ui/typography';
// import { useDrizzle } from '~/hooks/useDrizzle';
import { useGet } from '~/hooks/useGet';
import { getSupply } from '~/lib/helper';
import { useStore } from '~/lib/zustand/useStore';

export default function Home() {
  const { onlineSales, products, storeSales } = useGet();
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
  console.log('🚀 ~ Home ~ products:', products?.length);
  // const createCart = async () => {
  //   await db.insert(schema.cart).values({});
  // };
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

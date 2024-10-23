/* eslint-disable prettier/prettier */
import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { ScrollView, View, XStack } from 'tamagui';

import { Container } from '~/components/Container';
import { LogoutButton } from '~/components/LogoutButton';
import { DashBoardCards } from '~/components/home/DashBoardCards';
import { Products } from '~/components/ui/Products';
import { CustomHeading } from '~/components/ui/typography';
import { onlineSales, products, storeSales } from '~/db';
import OnlineSale from '~/db/model/OnlineSale';
import Product from '~/db/model/Product';
import StoreSales from '~/db/model/StoreSale';
import { useRender } from '~/hooks/useRender';
import { useStore } from '~/lib/zustand/useStore';
// import { getSale } from '~/lib/helper';

export const Main = ({
  onlineSales,
  products,
  storeSales,
}: {
  products: Product[];
  onlineSales: OnlineSale[];
  storeSales: StoreSales[];
}) => {
  useRender();
  const { width } = useWindowDimensions();

  const isSmallTablet = width >= 500;
  const isBigTablet = width >= 700;
  const containerWidth = isBigTablet ? '60%' : isSmallTablet ? '80%' : '100%';
  const limitedProducts = useMemo(() => {
    if (!products) return [];
    return products.slice(0, 10);
  }, [products]);

  return (
    <Container>
      <View width={containerWidth} mx="auto">
        <XStack justifyContent="space-between" alignItems="center">
          <CustomHeading text="Dashboard" fontSize={1.7} />
          <LogoutButton />
        </XStack>
        {/* <MyButton title="btn" onPress={createCart} /> */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}>
          <DashBoardCards products={products} salesP={onlineSales} salesS={storeSales} />
          <Products
            data={limitedProducts}
            text="Product list"
            linkText="View Product Page"
            href="/store"
            navigate
          />
        </ScrollView>
      </View>
    </Container>
  );
};

const enhance = withObservables([], () => ({
  products: products.query(Q.sortBy('created_at', Q.desc)),
  onlineSales: onlineSales.query(),
  storeSales: storeSales.query(),
}));

const HomeComponent = enhance(Main);
export default HomeComponent;

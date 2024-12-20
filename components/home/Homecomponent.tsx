/* eslint-disable prettier/prettier */
import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
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
import { useNetwork } from '~/hooks/useNetwork';
import { useRender } from '~/hooks/useRender';

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
  const isConnected = useNetwork();
  console.log({ isConnected });
  const isMid = width < 768;
  const isSmall = width < 425;

  const finalWidth = isSmall ? '100%' : isMid ? '100%' : '80%';

  const limitedProducts = products?.slice(0, 10) || [];

  return (
    <Container>
      <View width={finalWidth} mx="auto">
        <XStack justifyContent="space-between" alignItems="center">
          <CustomHeading text="Dashboard" fontSize={1.7} />
          <LogoutButton />
        </XStack>

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

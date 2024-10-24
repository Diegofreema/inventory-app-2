/* eslint-disable prettier/prettier */

import { FlashList } from '@shopify/flash-list';
import { useWindowDimensions } from 'react-native';
import { View } from 'tamagui';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';
import { Empty } from '../ui/empty';

import SupplyProduct from '~/db/model/SupplyProduct';
import { useGetProductName } from '~/hooks/useGetProductName';
import { trimText } from '~/lib/helper';

type Props = {
  supplyProduct: SupplyProduct[];
};

export const SupplyFlatList = ({ supplyProduct }: Props): JSX.Element => {
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;

  return (
    <FlashList
      data={supplyProduct}
      renderItem={({ item, index }) => <SupplyCard supplyProduct={item} index={index} />}
      estimatedItemSize={200}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => <Empty text="No disposed product found" />}
      contentContainerStyle={{ paddingBottom: 20 }}
      numColumns={isSmallTablet ? 2 : undefined}
      ItemSeparatorComponent={() => <View style={{ height: 20, width: 20 }} />}
    />
  );
};

const SupplyCard = ({
  supplyProduct,
  index,
}: {
  supplyProduct: SupplyProduct;
  index: number;
}): JSX.Element => {
  const name = useGetProductName(supplyProduct.productId);
  const gap = 15;

  return (
    <AnimatedCard
      index={index}
      style={{
        marginBottom: 15,
        marginRight: index % 1 === 0 ? gap : 0,
      }}>
      <FlexText text="Product" text2={trimText(name || '', 20)} />
      <FlexText text="Price" text2={`₦${supplyProduct.unitCost}`} />
      <FlexText text="Quantity" text2={`${supplyProduct.qty}`} />
      <FlexText text="Date" text2={`${supplyProduct.dateX}`} />
    </AnimatedCard>
  );
};

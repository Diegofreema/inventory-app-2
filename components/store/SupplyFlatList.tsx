/* eslint-disable prettier/prettier */

import { Q } from '@nozbe/watermelondb';
import { FlashList } from '@shopify/flash-list';
import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { View } from 'tamagui';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';
import { Empty } from '../ui/empty';

import { products } from '~/db';
import SupplyProduct from '~/db/model/SupplyProduct';
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
  const [productName, setProductName] = useState('');
  const gap = 15;
  useEffect(() => {
    const fetchData = async () => {
      const product = await products
        .query(Q.where('product_id', supplyProduct.productId), Q.take(1))
        .fetch();
      const singleProductName = product[0]?.product;
      setProductName(singleProductName);
    };
    fetchData();
  }, [supplyProduct.productId]);
  console.log({ productName }, supplyProduct.productId);

  return (
    <AnimatedCard
      index={index}
      style={{
        marginBottom: 15,
        marginRight: index % 1 === 0 ? gap : 0,
      }}>
      <FlexText text="Product" text2={trimText(productName || '', 20)} />
      <FlexText text="Price" text2={`₦${supplyProduct.unitCost}`} />
      <FlexText text="Quantity" text2={`${supplyProduct.qty}`} />
      <FlexText text="Date" text2={`${supplyProduct.dateX}`} />
    </AnimatedCard>
  );
};

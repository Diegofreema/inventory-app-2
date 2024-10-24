/* eslint-disable prettier/prettier */

import { FlatList, useWindowDimensions } from 'react-native';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';
import { Empty } from '../ui/empty';
import { CustomSubHeading } from '../ui/typography';

import SupplyProduct from '~/db/model/SupplyProduct';
import { useGetProductName } from '~/hooks/useGetProductName';
import { trimText } from '~/lib/helper';

type Props = {
  data: SupplyProduct[];
  scroll?: boolean;
};

export const ProductSupply = ({ data, scroll = true }: Props): JSX.Element => {
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  return (
    <FlatList
      scrollEnabled={scroll}
      ListHeaderComponent={() => <CustomSubHeading text="Product Supply" fontSize={2.2} />}
      data={data}
      renderItem={({ item, index }) => <SupplyCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No Supply for this date" />}
      numColumns={isSmallTablet ? 2 : undefined}
      columnWrapperStyle={isSmallTablet && { gap: 20 }}
    />
  );
};

const SupplyCard = ({ item, index }: { item: SupplyProduct; index: number }) => {
  const totalPrice = Number(item.unitCost) * Number(item?.qty);
  const name = useGetProductName(item.productId);

  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={trimText(name, 20)} />
      <FlexText text="Date" text2={item?.dateX!} />
      <FlexText text="Quantity" text2={item?.qty.toString()} />
      <FlexText text="Cost" text2={'₦' + totalPrice.toString()} />
    </AnimatedCard>
  );
};

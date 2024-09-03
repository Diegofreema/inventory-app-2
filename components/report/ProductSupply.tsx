/* eslint-disable prettier/prettier */

import { FlatList } from 'react-native';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';
import { Empty } from '../ui/empty';
import { CustomSubHeading } from '../ui/typography';

import SupplyProduct from '~/db/model/SupplyProduct';
import { useGet } from '~/hooks/useGet';

type Props = {
  data: SupplyProduct[];
  scroll?: boolean;
};

export const ProductSupply = ({ data, scroll = true }: Props): JSX.Element => {
  return (
    <FlatList
      scrollEnabled={scroll}
      ListHeaderComponent={() => <CustomSubHeading text="Product Supply" fontSize={20} />}
      data={data}
      renderItem={({ item, index }) => <SupplyCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No Supply for this date" />}
    />
  );
};

const SupplyCard = ({ item, index }: { item: SupplyProduct; index: number }) => {
  const { singleProduct } = useGet(item?.productId);
  const totalPrice = Number(item.unitCost) * Number(item?.qty);
  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={singleProduct?.product} />
      <FlexText text="Date" text2={item?.dateX!} />
      <FlexText text="Quantity" text2={item?.qty.toString()} />
      <FlexText text="Cost" text2={'₦' + totalPrice.toString()} />
    </AnimatedCard>
  );
};

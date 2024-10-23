/* eslint-disable prettier/prettier */
import { FlatList, useWindowDimensions } from 'react-native';

import { CustomSubHeading } from '../ui/typography';

import { AnimatedCard } from '~/components/ui/AnimatedCard';
import { FlexText } from '~/components/ui/FlexText';
import { Empty } from '~/components/ui/empty';
import DisposedProducts from '~/db/model/DisposedProducts';

type Props = {
  data: DisposedProducts[];
  scroll?: boolean;
};
export const Disposal = ({ data, scroll = true }: Props) => {
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  return (
    <FlatList
      scrollEnabled={scroll}
      ListHeaderComponent={() => <CustomSubHeading text="Disposal" fontSize={2.2} />}
      data={data}
      renderItem={({ item, index }) => <DisposalCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No disposal for this date" />}
      numColumns={isSmallTablet ? 2 : undefined}
      columnWrapperStyle={isSmallTablet && { gap: 20 }}
    />
  );
};

const DisposalCard = ({ index, item }: { item: DisposedProducts; index: number }) => {
  const cost = Number(item?.unitCost) * Number(item?.qty);
  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={item?.name} />
      <FlexText text="Date" text2={item?.dateX} />
      <FlexText text="Quantity" text2={item?.qty.toString()} />
      <FlexText text="Cost" text2={`₦${cost.toString()}`} />
    </AnimatedCard>
  );
};

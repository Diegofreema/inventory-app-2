/* eslint-disable prettier/prettier */
import { FlatList } from 'react-native';

import { AnimatedCard } from '~/components/ui/AnimatedCard';
import { FlexText } from '~/components/ui/FlexText';
import { Empty } from '~/components/ui/empty';
import { DisposedSelect } from '~/db/schema';
import { useGet } from '~/hooks/useGet';

type Props = {
  data: DisposedSelect[];
  scroll?: boolean;
};
export const Disposal = ({ data, scroll = true }: Props) => {
  console.log(data);
  return (
    <FlatList
      scrollEnabled={scroll}
      data={data}
      renderItem={({ item, index }) => <DisposalCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No disposal for this date" />}
    />
  );
};

const DisposalCard = ({ index, item }: { item: DisposedSelect; index: number }) => {
  const { singleProduct } = useGet(item?.productId);
  const cost = Number(item?.unitCost) * Number(item?.qty);
  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={singleProduct?.product} />
      <FlexText text="Date" text2={item?.dateX} />
      <FlexText text="Quantity" text2={item?.qty.toString()} />
      <FlexText text="Cost" text2={`₦${cost.toString()}`} />
    </AnimatedCard>
  );
};

/* eslint-disable prettier/prettier */

import { FlatList } from 'react-native';

import { AnimatedCard } from './ui/AnimatedCard';
import { FlexText } from './ui/FlexText';
import { Empty } from './ui/empty';

import { CartItemSelect, ProductSelect } from '~/db/schema';
export type CartItemWithProductField = CartItemSelect & { product: ProductSelect };
type Props = {
  data: CartItemWithProductField[];
};

export const CartFlatList = ({ data }: Props): JSX.Element => {
  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => <CartCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No item in cart" />}
    />
  );
};

const CartCard = ({ item, index }: { item: CartItemWithProductField; index: number }) => {
  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={item?.product.product} />
      <FlexText
        text="Price"
        text2={`
₦${item?.product.sellingprice!}`}
      />
      <FlexText text="Quantity" text2={item?.qty.toString()} />
    </AnimatedCard>
  );
};

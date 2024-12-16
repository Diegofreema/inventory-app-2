/* eslint-disable prettier/prettier */
import { FlashList } from '@shopify/flash-list';
import { useWindowDimensions } from 'react-native';
import { View } from 'tamagui';

import { AnimatedCard } from './ui/AnimatedCard';
import { FlexText } from './ui/FlexText';
import { Empty } from './ui/empty';

import DisposedProducts from '~/db/model/DisposedProducts';
import { useGetProductName } from '~/hooks/useGetProductName';
import { trimText } from '~/lib/helper';

type Props = {
  disposedProduct: DisposedProducts[];
};

export const DisposedFlatList = ({ disposedProduct }: Props): JSX.Element => {
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;


  return (
    <View flex={1} marginTop={10}>
      <FlashList
        data={disposedProduct}
        renderItem={({ item, index }) => <DisPosedCard disposedProduct={item} index={index} />}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <Empty text="No disposed product found" />}
        contentContainerStyle={{ paddingBottom: 20 }}
        numColumns={isSmallTablet ? 2 : undefined}
        ItemSeparatorComponent={() => <View style={{ height: 20, width: 20 }} />}
      />
    </View>
  );
};

const DisPosedCard = ({
  disposedProduct,
  index,
}: {
  disposedProduct: DisposedProducts;
  index: number;
}) => {
  const productName = useGetProductName(disposedProduct?.productId);

  const gap = 15;
  return (
    <AnimatedCard
      index={index}
      style={{
        marginBottom: 15,
        marginRight: index % 1 === 0 ? gap : 0,
      }}>
      <FlexText text="Product" text2={trimText(productName || '', 20)} />
      <FlexText text="Price" text2={`₦${disposedProduct.unitCost}`} />
      <FlexText text="Quantity" text2={`${disposedProduct.qty}`} />
      <FlexText text="Date" text2={`${disposedProduct.dateX}`} />
    </AnimatedCard>
  );
};

import { View } from 'tamagui';

import { Container } from '~/components/Container';
import { FlexText } from '~/components/ui/FlexText';
import { ProductLoader } from '~/components/ui/Loading';
import { NavHeader } from '~/components/ui/NavHeader';
import { Products } from '~/components/ui/Products';
import { useFetchLowStock } from '~/lib/tanstack/queries';

const LowStock = () => {
  const { data, isPending } = useFetchLowStock();
  return (
    <Container>
      <NavHeader title="Low stock" />
      {isPending ? (
        <ProductLoader />
      ) : (
        <View gap={10} flex={1}>
          <FlexText text="Total low stock products" text2={data?.length || 0} />
          <Products data={data} navigate scrollEnabled />
        </View>
      )}
    </Container>
  );
};

export default LowStock;

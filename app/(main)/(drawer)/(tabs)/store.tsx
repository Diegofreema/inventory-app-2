import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { View } from 'tamagui';

import { Container } from '~/components/Container';
import { DisposedProduct } from '~/components/store/DisposedProducts';
import { Expenditure } from '~/components/store/Expenditure';
import { Expenses } from '~/components/store/Expenses';
import { ScrollHeader } from '~/components/store/ScrollHeader';
import { Staffs } from '~/components/store/Staffs';
import { StoreProducts } from '~/components/store/StoreProducts';
import { SupplyProducts } from '~/components/store/SupplyProducts';

const data = [
  'Products',
  'Expenditure',
  'Expenses',
  'Supplied Products',
  'Disposed Products',
  'Sales Attendants',
];
const COMPONENTS = [StoreProducts, Expenditure, Expenses, SupplyProducts, DisposedProduct, Staffs];
export default function Store() {
  const [active, setActive] = useState(0);
  const ActiveComponent = COMPONENTS[active] || StoreProducts;
  const { width } = useWindowDimensions();
  const isSmall = width < 425;
  const isMid = !isSmall && width < 768;

  const finalWidth = isSmall || isMid ? '100%' : '80%';
  return (
    <Container>
      <View flex={1} width={finalWidth} mx="auto">
        <ScrollHeader screens={data} active={active} setActive={setActive} />
        <ActiveComponent />
      </View>
    </Container>
  );
}

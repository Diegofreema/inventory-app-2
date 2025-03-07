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

export default function Store() {
  const [active, setActive] = useState(0);
  let ActiveComponent = StoreProducts;
  if (active === 0) {
    ActiveComponent = StoreProducts;
  }
  if (active === 1) {
    ActiveComponent = Expenditure;
  }
  if (active === 2) {
    ActiveComponent = Expenses;
  }
  if (active === 3) {
    ActiveComponent = SupplyProducts;
  }
  if (active === 4) {
    ActiveComponent = DisposedProduct;
  }
  if (active === 5) {
    ActiveComponent = Staffs;
  }
  const { width } = useWindowDimensions();
  const isMid = width < 768;
  const isSmall = width < 425;

  const finalWidth = isSmall ? '100%' : isMid ? '100%' : '80%';
  return (
    <Container>
      <View flex={1} width={finalWidth} mx="auto">
        <ScrollHeader screens={data} active={active} setActive={setActive} />
        <ActiveComponent />
      </View>
    </Container>
  );
}

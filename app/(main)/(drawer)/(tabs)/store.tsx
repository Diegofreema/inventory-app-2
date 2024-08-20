import { useState } from 'react';

import { Container } from '~/components/Container';
import { Expenditure } from '~/components/store/Expenditure';
import { Expenses } from '~/components/store/Expenses';
import { ScrollHeader } from '~/components/store/ScrollHeader';
import { Staffs } from '~/components/store/Staffs';
import { StoreProducts } from '~/components/store/StoreProducts';

const data = ['Products', 'Expenditure', 'Expenses', 'Sales Attendants'];
const COMPONENTS = [StoreProducts, Expenditure, Expenses, Staffs];
export default function Store() {
  const [active, setActive] = useState(0);
  const ActiveComponent = COMPONENTS[active] || StoreProducts;

  return (
    <Container>
      <ScrollHeader screens={data} active={active} setActive={setActive} />
      <ActiveComponent />
    </Container>
  );
}

/* eslint-disable prettier/prettier */

import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import { format, isWithinInterval } from 'date-fns';
import { useMemo } from 'react';

import { SupplyFlatList } from './SupplyFlatList';

import { supplyProduct } from '~/db';
import SupplyProduct from '~/db/model/SupplyProduct';

type Props = {
  suppliedProducts: SupplyProduct[];
  startDate: string;
  endDate: string;
};

export const Supply = ({ suppliedProducts, startDate, endDate }: Props): JSX.Element => {

  const filterByDate = useMemo(() => {
    if (!suppliedProducts) return [];
    if (!startDate || !endDate) return suppliedProducts;

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');

    return suppliedProducts.filter((d) => {
      const salesDate = d?.dateX?.split(' ')[0]?.replace('/', '-')?.replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });
  }, [suppliedProducts, startDate, endDate]);
  console.log(filterByDate[0].productId);
  return <SupplyFlatList supplyProduct={filterByDate} />;
};

const enhancedComponent = withObservables([], () => ({
  suppliedProducts: supplyProduct?.query(Q.sortBy('created_at', Q.desc)).observe(),
}));
const EnhancedSupply = enhancedComponent(Supply);
export default EnhancedSupply;

/* eslint-disable prettier/prettier */

import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import { format, isWithinInterval } from 'date-fns';
import { useMemo } from 'react';

import { SupplyFlatList } from './SupplyFlatList';

import { supplyProduct } from '~/db';
import SupplyProduct from '~/db/model/SupplyProduct';

type Props = {
  suppliedProduct: SupplyProduct[];
  startDate: string;
  endDate: string;
  value: string;
};

export const Supply = ({ suppliedProduct, startDate, endDate, value }: Props): JSX.Element => {
  const filterByDate = useMemo(() => {
    if (!suppliedProduct) return [];
    if (!startDate || !endDate) return suppliedProduct;

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');

    return suppliedProduct.filter((d) => {
      const salesDate = d?.dateX?.split(' ')[0]?.replace('/', '-')?.replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });
  }, [suppliedProduct, startDate, endDate]);
  const filteredValue: SupplyProduct[] = useMemo(() => {
    if (!value.trim()) {
      return filterByDate || [];
    }

    const lowerCaseValue = value.toLowerCase();

    return (
      filterByDate?.filter((d) => {
        return d.name.toLowerCase().includes(lowerCaseValue);
      }) || []
    );
  }, [value, filterByDate]);
  return <SupplyFlatList supplyProduct={filteredValue} />;
};

const enhancedComponent = withObservables([], () => ({
  suppliedProduct: supplyProduct?.query(Q.sortBy('created_at', Q.desc)).observe(),
}));
const EnhancedSupply = enhancedComponent(Supply);
export default EnhancedSupply;

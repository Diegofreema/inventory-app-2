/* eslint-disable prettier/prettier */

import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import { format, isWithinInterval } from 'date-fns';
import { useMemo } from 'react';

import { DisposedFlatList } from '../DisposedFlatList';

import { disposedProducts } from '~/db';
import DisposedProducts from '~/db/model/DisposedProducts';

const DisposedProductsFlatList = ({
  disposedProduct,
  value,
  startDate,
  endDate,
}: {
  disposedProduct: DisposedProducts[];
  value: string;
  startDate: Date;
  endDate: Date;
}) => {
  const filterByDate = useMemo(() => {
    if (!disposedProduct) return [];
    if (!startDate || !endDate) return disposedProduct;

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');

    return disposedProduct.filter((d) => {
      const salesDate = d?.dateX?.split(' ')[0]?.replace('/', '-')?.replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });
  }, [disposedProduct, startDate, endDate]);

  return <DisposedFlatList disposedProduct={filterByDate} />;
};

const enhancedComponent = withObservables([], () => ({
  disposedProduct: disposedProducts?.query(Q.sortBy('created_at', Q.desc)).observe(),
}));
const EnhancedComponent = enhancedComponent(DisposedProductsFlatList);
export default EnhancedComponent;

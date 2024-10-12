/* eslint-disable prettier/prettier */

import { format, isWithinInterval } from 'date-fns';
import { useMemo } from 'react';

import DisposedProducts from '~/db/model/DisposedProducts';
import Expenses from '~/db/model/Expenses';
import StoreSales from '~/db/model/StoreSale';
import SupplyProduct from '~/db/model/SupplyProduct';

type Props = {
  startDate: string;
  endDate: string;
  productSupply: SupplyProduct[];
  storeSales: StoreSales[];
  expense: Expenses[];
  disposal: DisposedProducts[];
};

export const useFilterData = ({
  expense,
  endDate,
  startDate,
  productSupply,
  storeSales,
  disposal,
}: Props) => {
  const filterData = useMemo(() => {
    if (!startDate || !endDate || !storeSales) return [];

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');

    return storeSales.filter((d) => {
      const salesDate = d.dateX.split(' ')[0].replace('/', '-').replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });
  }, [storeSales, startDate, endDate]);
  // ? filter supply
  const filterSupply = useMemo(() => {
    if (!startDate || !endDate || !productSupply) return [];

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');

    return productSupply.filter((d) => {
      const salesDate = d?.dateX?.split(' ')[0].replace('/', '-').replace('/', '-');
      if (!salesDate) return productSupply;
      return isWithinInterval(salesDate, { start, end });
    });
  }, [startDate, endDate, productSupply]);
  // ? filter expense
  const filterExpense = useMemo(() => {
    if (!startDate || !endDate || !expense) return [];

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');
    return expense.filter((d) => {
      const salesDate = d.dateX.split(' ')[0].replace('/', '-').replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });
  }, [startDate, endDate, expense]);

  // ? filter disposal
  const filteredDisposal = useMemo(() => {
    if (!startDate || !endDate || !disposal) return [];

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');
    return disposal.filter((d) => {
      const salesDate = d.dateX.split(' ')[0].replace('/', '-').replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });
  }, [startDate, endDate, disposal]);

  return { filterExpense, filterSupply, filterData, filteredDisposal };
};

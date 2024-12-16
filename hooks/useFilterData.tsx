/* eslint-disable prettier/prettier */

import { format, isWithinInterval, parse } from 'date-fns';
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
      const salesDate = d?.dateX?.split(' ')[0];
      const salesYear = salesDate?.split('/')[2];
      const salesMonth = salesDate?.split('/')[1];
      const salesDay = salesDate?.split('/')[0];
      const dateToCompare = new Date(+salesYear, +salesMonth - 1, +salesDay);
      const begin = new Date(+start.split('-')[2], +start.split('-')[1] - 1, +start.split('-')[0]);
      const ended = new Date(+end.split('-')[2], +end.split('-')[1] - 1, +end.split('-')[0]);

      return dateToCompare >= begin && dateToCompare <= ended;
    });
  }, [storeSales, startDate, endDate]);
  // ? filter supply
  const filterSupply = useMemo(() => {
    if (!startDate || !endDate || !productSupply) return [];

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');

    return productSupply.filter((d) => {

      const salesDate = d?.dateX?.split(' ')[0];
      const salesYear = salesDate?.split('/')[2];
      const salesMonth = salesDate?.split('/')[1];
      const salesDay = salesDate?.split('/')[0];
      const dateToCompare = new Date(+salesYear, +salesMonth - 1, +salesDay);
      const begin = new Date(+start.split('-')[2], +start.split('-')[1] - 1, +start.split('-')[0]);
      const ended = new Date(+end.split('-')[2], +end.split('-')[1] - 1, +end.split('-')[0]);


      if (!salesDate) return productSupply;
      return dateToCompare >= begin && dateToCompare <= ended;
    });
  }, [startDate, endDate, productSupply]);
  // ? filter expense
  const filterExpense = useMemo(() => {
    if (!startDate || !endDate || !expense) return [];

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');
    return expense.filter((d) => {

      const salesDate = d?.dateX?.split(' ')[0];
      const salesYear = salesDate?.split('/')[2];
      const salesMonth = salesDate?.split('/')[1];
      const salesDay = salesDate?.split('/')[0];
      const dateToCompare = new Date(+salesYear, +salesMonth - 1, +salesDay);
      const begin = new Date(+start.split('-')[2], +start.split('-')[1] - 1, +start.split('-')[0]);
      const ended = new Date(+end.split('-')[2], +end.split('-')[1] - 1, +end.split('-')[0]);



      return dateToCompare >= begin && dateToCompare <= ended;
    });
  }, [startDate, endDate, expense]);

  // ? filter disposal
  const filteredDisposal = useMemo(() => {
    if (!startDate || !endDate || !disposal) return [];

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');
    return disposal.filter((d) => {
      const salesDate = d?.dateX?.split(' ')[0];
      const salesYear = salesDate?.split('/')[2];
      const salesMonth = salesDate?.split('/')[1];
      const salesDay = salesDate?.split('/')[0];
      const dateToCompare = new Date(+salesYear, +salesMonth - 1, +salesDay);
      const begin = new Date(+start.split('-')[2], +start.split('-')[1] - 1, +start.split('-')[0]);
      const ended = new Date(+end.split('-')[2], +end.split('-')[1] - 1, +end.split('-')[0]);


      if (!salesDate) return productSupply;
      return dateToCompare >= begin && dateToCompare <= ended;
    });
  }, [startDate, endDate, disposal]);

  return { filterExpense, filterSupply, filterData, filteredDisposal };
};

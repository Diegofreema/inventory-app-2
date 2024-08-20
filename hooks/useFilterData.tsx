/* eslint-disable prettier/prettier */

import { format, isWithinInterval } from 'date-fns';
import { useMemo } from 'react';

import { ExpType, SalesS, SupplyType } from '~/type';

type Props = {
  startDate: string;
  endDate: string;
  productSupply: SupplyType[];
  storeSales: SalesS[];
  expense: ExpType[];
  disposal: SupplyType[]
};

export const useFilterData = ({
  expense,
  endDate,
  startDate,
  productSupply,
  storeSales,
  disposal
}: Props) => {
  const filterData = useMemo(() => {
    if (!startDate || !endDate || !storeSales) return [];

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');



    return storeSales.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });
  }, [storeSales, startDate, endDate]);
  const filterSupply = useMemo(() => {
    if (!startDate || !endDate || !productSupply) return [];

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');



    return productSupply.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });
  }, [startDate, endDate, productSupply]);
  const filterExpense = useMemo(() => {
    if (!startDate || !endDate || !expense) return [];

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');
    return expense.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });


  }, [startDate, endDate, expense]);
  const filteredDisposal = useMemo(() => {
    if (!startDate || !endDate || !disposal) return [];

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');
    return disposal.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });


  }, [startDate, endDate, disposal]);


  return { filterExpense, filterSupply, filterData,filteredDisposal };
};

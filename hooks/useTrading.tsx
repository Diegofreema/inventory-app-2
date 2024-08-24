/* eslint-disable prettier/prettier */

import { format, isWithinInterval, subDays } from 'date-fns';
import { useMemo } from 'react';

import { totalAmount } from '~/lib/helper';
import { ExpType, SalesP, SalesS, SupplyType } from '~/type';

type Props = {
  startDate: string;
  endDate: string;
  onlineSales: SalesP[];
  storeSales: SalesS[];
  disposal: SupplyType[];
  expense: ExpType[];
  productSupply: SupplyType[];
};

export const useTrading = ({
  disposal,
  endDate,
  expense,
  onlineSales,
  productSupply,
  startDate,
  storeSales,
}: Props) => {
  const emptyDates = !startDate || !endDate;

  const openningStock = useMemo(() => {
    if (!productSupply || emptyDates || !disposal || !storeSales || !onlineSales) return 0;
    const start = format(startDate, 'MM-dd-yyyy');
    const end = format(endDate, 'MM-dd-yyyy');
    const dataToFilter = productSupply.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');
      return isWithinInterval(salesDate, { start: subDays(start, 1), end });
    });
    const numbers = dataToFilter?.map((sale) => Number(sale?.unitcost) * Number(sale?.qty));
    return totalAmount(numbers);
  }, [productSupply, emptyDates]);
  // ? Online sales
  const memoizedOnlineSales = useMemo(() => {
    if (!onlineSales || emptyDates) return 0;
    const start = format(startDate, 'MM-dd-yyyy');
    const end = format(endDate, 'MM-dd-yyyy');
    const dataToFilter = onlineSales.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');
      console.log({ salesDate });

      return isWithinInterval(salesDate, { start, end });
    });
    const numbers = dataToFilter?.map((sale) => Number(sale?.dealershare) * Number(sale?.qty));
    return totalAmount(numbers);
  }, [onlineSales]);
  console.log({ storeSales });

  // ? Store sales
  const memoizedOfflineSales = useMemo(() => {
    if (!storeSales || emptyDates) return 0;
    const start = format(startDate, 'MM-dd-yyyy');
    const end = format(endDate, 'MM-dd-yyyy');
    const filteredData = storeSales.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');
      return isWithinInterval(salesDate, { start, end });
    });
    const numbers = filteredData?.map((sale) => {
      if (sale?.paid === 'True') return Number(sale?.unitprice) * Number(sale?.qty);
      return 0;
    });
    return totalAmount(numbers);
  }, [storeSales]);

  //  ? Disposal
  const memoizedDisposal = useMemo(() => {
    if (!disposal || emptyDates) return 0;
    const start = format(startDate, 'MM-dd-yyyy');
    const end = format(endDate, 'MM-dd-yyyy');
    const filteredData = disposal.filter((d) => {
      const salesDate = d?.datex.split(' ')[0].replace('/', '-').replace('/', '-');
      return isWithinInterval(salesDate, { start, end });
    });
    const numbers = filteredData?.map((d) => Number(d?.unitcost) * Number(d?.qty));
    return totalAmount(numbers);
  }, [disposal, emptyDates]);

  const memoizedSupply = useMemo(() => {
    if (!productSupply || emptyDates) return 0;
    const numbers = productSupply?.map((p) => Number(p?.unitcost) * Number(p?.qty));
    return totalAmount(numbers);
  }, [productSupply]);

  const memoizedExpense = useMemo(() => {
    if (!expense || emptyDates) return [];
    const expenseDates = expense.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');
      return isWithinInterval(salesDate, { start: startDate, end: endDate });
    });

    return expenseDates;
  }, [expense, emptyDates]);

  return {
    openningStock,
    memoizedOnlineSales,
    memoizedOfflineSales,
    memoizedDisposal,
    memoizedSupply,
    memoizedExpense,
  };
};

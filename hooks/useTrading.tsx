/* eslint-disable prettier/prettier */

import { format, isWithinInterval, isBefore, max, parseISO } from 'date-fns';
import { useMemo } from 'react';

import { rearrangeDateString, totalAmount } from '~/lib/helper';
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
  const dates = [
    '2022-01-01',
    '2022-01-02',
    '2022-01-03',
    '2022-01-04',
    '2022-01-05',
    '2022-01-06',
  ];
  const maxDate = max(dates);

  const formattedDate = format(maxDate, 'dd-MM-yyyy');
  console.log(formattedDate, 'formattedDate');

  const openingStock = useMemo(() => {
    if (!productSupply || emptyDates || !disposal || !storeSales || !onlineSales) return 0;
    const start = format(startDate, 'yyyy-MM-dd');

    // console.log(productSupply?.[0].datex?.split(' ')[0].trim(), start);
    const store = storeSales.filter((d) => {
      const salesDate = rearrangeDateString(d.datex.split(' ')[0]);
      return isBefore(salesDate, start);
    });

    const online = onlineSales.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');
      return isBefore(salesDate, start);
    });

    const disposed = disposal.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');

      return isBefore(start, salesDate);
    });

    const dataToFilter = productSupply.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');
      return isBefore(salesDate, start);
    });

    const allProducts = dataToFilter?.map((sale) => {
      const maxDate = max(
        dataToFilter.map((d) => {
          return format(d.datex.split(' ')[0].replace('/', '-').replace('/', '-'), 'yyyy-MM-dddd');
        })
      );
      const recentDate = dataToFilter.find(
        (d) =>
          d.datex.split(' ')[0].replace('/', '-').replace('/', '-') ===
          format(maxDate, 'dd-MM-yyyy')
      );

      return Number(recentDate?.unitcost) || 0 * Number(sale?.qty) || 0;
    });

    const allStore = store?.map((sale) => {
      const maxDate = max(store.map((d) => rearrangeDateString(d.datex.split(' ')[0])));
      if (sale.paid === 'True') {
        const recentPrice = store.find(
          (s) => rearrangeDateString(s.datex.split(' ')[0]) === format(maxDate, 'yyyy-MM-dd')
        );

        console.log(recentPrice, 'recentPrice');

        return Number(recentPrice?.unitprice) || 0 * Number(sale?.qty) || 0;
      }
      return 0;
    });
    const allOnline = online?.map((sale) => Number(sale?.dealershare) * Number(sale?.qty));
    const allDisposed = disposed?.map((sale) => {
      const maxDate = max(disposed.map((d) => rearrangeDateString(d.datex.split(' ')[0])));
      console.log(
        disposed.map((d) => {
          const formatedDate = rearrangeDateString(d.datex.split(' ')[0]);
          return parseISO(formatedDate);
        })
      );

      const recentPrice = disposed.find(
        (d) => rearrangeDateString(d.datex.split(' ')[0]) === format(maxDate, 'yyyy-MM-dd')
      );

      return Number(recentPrice?.unitcost) || 0 * Number(sale?.qty) || 0;
    });
    console.log(totalAmount(allStore), 'bscn');

    const total =
      totalAmount(allProducts) -
      totalAmount(allDisposed) -
      totalAmount(allStore) -
      totalAmount(allOnline);

    return total <= 0 ? 0 : total;
  }, [productSupply, emptyDates, disposal, storeSales, onlineSales, startDate]);
  // ? Online sales
  const memoizedOnlineSales = useMemo(() => {
    if (!onlineSales || emptyDates) return 0;
    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');
    const dataToFilter = onlineSales.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });
    const numbers = dataToFilter?.map((sale) => Number(sale?.dealershare) * Number(sale?.qty));
    return totalAmount(numbers);
  }, [onlineSales, emptyDates, startDate, endDate]);

  // ? Store sales
  const memoizedOfflineSales = useMemo(() => {
    if (!storeSales || emptyDates) return 0;
    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');
    const filteredData = storeSales.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');
      return isWithinInterval(salesDate, { start, end });
    });
    const numbers = filteredData?.map((sale) => {
      if (sale?.paid === 'True') return Number(sale?.unitprice) * Number(sale?.qty);
      return 0;
    });
    return totalAmount(numbers);
  }, [storeSales, emptyDates, startDate, endDate]);

  //  ? Disposal
  //#region
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
  //#endregion
  const memoizedSupply = useMemo(() => {
    if (!productSupply || emptyDates) return 0;
    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');
    const filteredData = productSupply.filter((d) => {
      const salesDate = d?.datex.split(' ')[0].replace('/', '-').replace('/', '-');
      return isWithinInterval(salesDate, { start, end });
    });
    const numbers = filteredData?.map((p) => Number(p?.unitcost) * Number(p?.qty));
    return totalAmount(numbers);
  }, [productSupply, emptyDates]);

  const memoizedExpense = useMemo(() => {
    if (!expense || emptyDates) return [];
    const expenseDates = expense.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');
      return isWithinInterval(salesDate, { start: startDate, end: endDate });
    });

    return expenseDates;
  }, [expense, emptyDates, startDate, endDate]);

  const closingStock = useMemo(() => {
    if (!expense || !disposal || !productSupply || emptyDates) return 0;
  }, []);

  return {
    openingStock,
    memoizedOnlineSales,
    memoizedOfflineSales,
    memoizedDisposal,
    memoizedSupply,
    memoizedExpense,
  };
};

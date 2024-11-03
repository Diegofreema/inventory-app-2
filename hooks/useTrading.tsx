/* eslint-disable prettier/prettier */

import { format, isBefore, isWithinInterval } from 'date-fns';
import { useMemo } from 'react';

import DisposedProducts from '~/db/model/DisposedProducts';
import Expenses from '~/db/model/Expenses';
import OnlineSale from '~/db/model/OnlineSale';
import StoreSales from '~/db/model/StoreSale';
import SupplyProduct from '~/db/model/SupplyProduct';
import {
  calculateActualInventory, mergeProductOpening,
  mergeProducts,
  mergeProducts2,
  rearrangeDateString,
  totalAmount
} from "~/lib/helper";

type Props = {
  startDate: string;
  endDate: string;
  onlineSales: OnlineSale[];
  storeSales: StoreSales[];
  disposal: DisposedProducts[];
  expense: Expenses[];
  productSupply: SupplyProduct[];
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

  const openingStock = useMemo(() => {
    if (!productSupply || emptyDates || !disposal || !storeSales || !onlineSales) return 0;
    const start = format(startDate, 'yyyy-MM-dd');

    const store = storeSales
      .filter((d) => {
        const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);

        return isBefore(salesDate, start);
      })
      .map((d) => ({
        qty: d.qty,
        productId: d.productId,
      }));

    const online = onlineSales
      .filter((d) => {
        const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);

        return isBefore(salesDate, start);
      })
      .map((d) => ({
        qty: d.qty,
        productId: d.productId,
      }));

    const disposed = disposal
      .filter((d) => {
        const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);

        return isBefore(salesDate, start);
      })
      .map((d) => ({
        qty: d.qty,
        productId: d.productId,
      }));

    // ? start of  supply product
    const dataSupply = productSupply
      .filter((d) => {
        const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);

        return isBefore(salesDate, start);
      })
      .map((d) => ({
        qty: d.qty,
        productId: d.productId,
        unitCost: Math.round(d.unitCost),
        dateX: d.dateX,
      }));

    const dt = mergeProductOpening(dataSupply);
    const productSales = mergeProducts2(store);
    const pharmacySales = mergeProducts2(online);
    const disposedProducts = mergeProducts2(disposed);
    const finalData = calculateActualInventory(dt, disposedProducts, pharmacySales, productSales);

    const total = totalAmount(finalData);

    return total <= 0 ? 0 : total;
  }, [productSupply, emptyDates, disposal, storeSales, onlineSales, startDate]);

  // ? Online sales
  const memoizedOnlineSales = useMemo(() => {
    if (!onlineSales || emptyDates) return 0;
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');

    const dataToFilter = onlineSales.filter((d) => {
      const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);

      return isWithinInterval(salesDate, { start, end });
    });

    const numbers = dataToFilter?.map((sale) => Math.round(sale?.dealerShare) * sale?.qty);
    return totalAmount(numbers);
  }, [onlineSales, emptyDates, startDate, endDate]);

  // ? Store sales
  const memoizedOfflineSales = useMemo(() => {
    if (!storeSales || emptyDates) return 0;
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');
    const filteredData = storeSales.filter((d) => {
      const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);
      return isWithinInterval(salesDate, { start, end });
    });
    const numbers = filteredData?.map((sale) => {
      return Math.round(sale?.unitPrice) * sale?.qty;
    });
    return totalAmount(numbers);
  }, [storeSales, emptyDates, startDate, endDate]);

  //  ? Disposal
  //#region
  const memoizedDisposal = useMemo(() => {
    if (!disposal || emptyDates) return 0;
    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');
    const filteredData = disposal.filter((d) => {
      const salesDate = d?.dateX.split(' ')[0].replace('/', '-').replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });
    const numbers = filteredData?.map((d) => Number(d?.unitCost) * Number(d?.qty));
    return totalAmount(numbers);
  }, [disposal, emptyDates]);
  //#endregion
  const memoizedSupply = useMemo(() => {
    if (!productSupply || emptyDates) return 0;
    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');
    const filteredData = productSupply.filter((d) => {
      const salesDate = d?.dateX.split(' ')[0].replace('/', '-').replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });

    const numbers = filteredData?.map((padding) => Math.round(padding?.unitCost) * padding?.qty);

    return totalAmount(numbers);
  }, [productSupply, emptyDates]);

  const memoizedExpense = useMemo(() => {
    if (!expense || emptyDates) return [];
    return expense.filter((d) => {
      const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);
      return isWithinInterval(salesDate, { start: startDate, end: endDate });
    });
  }, [expense, emptyDates, startDate, endDate]);

  const closingStock = useMemo(() => {
    if (!expense || !disposal || !productSupply || emptyDates) return 0;
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');
    const store = storeSales
      .filter((d) => {
        const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);
        return isBefore(salesDate, start) || isWithinInterval(salesDate, { start, end });
      })
      .map((d) => ({
        qty: d.qty,
        productId: d.productId,
      }));

    const online = onlineSales
      .filter((d) => {
        const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);
        return isBefore(salesDate, start) || isWithinInterval(salesDate, { start, end });
      })
      .map((d) => ({
        qty: d.qty,
        productId: d.productId,
      }));

    const disposed = disposal
      .filter((d) => {
        const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);

        return isBefore(salesDate, start) || isWithinInterval(salesDate, { start, end });
      })
      .map((d) => ({
        qty: d.qty,
        productId: d.productId,
      }));

    const dataSupply = productSupply
      .filter((d) => {
        const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);
        return isBefore(salesDate, start) || isWithinInterval(salesDate, { start, end });
      })
      .map((d) => {
        return {
          qty: d.qty,
          productId: d.productId,
          unitCost: d.unitCost,
          dateX: d.dateX,
        };
      });

    const dt = mergeProducts(dataSupply);
    const productSales = mergeProducts2(store);
    const pharmacySales = mergeProducts2(online);
    const disposedProducts = mergeProducts2(disposed);

    const finalData = calculateActualInventory(dt, disposedProducts, pharmacySales, productSales);

    const total = totalAmount(finalData);

    return total <= 0 ? 0 : total;
  }, [productSupply, emptyDates, disposal, storeSales, onlineSales, startDate, endDate]);

  return {
    openingStock,
    memoizedOnlineSales,
    memoizedOfflineSales,
    memoizedDisposal,
    memoizedSupply,
    memoizedExpense,
    closingStock,
  };
};

/* eslint-disable prettier/prettier */

import { format, isBefore, isWithinInterval, max } from 'date-fns';
import { useMemo } from 'react';

import DisposedProducts from '~/db/model/DisposedProducts';
import Expenses from '~/db/model/Expenses';
import OnlineSale from '~/db/model/OnlineSale';
import StoreSales from '~/db/model/StoreSale';
import SupplyProduct from '~/db/model/SupplyProduct';
import { rearrangeDateString, totalAmount } from '~/lib/helper';

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

    const store = storeSales.filter((d) => {
      const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);

      return isBefore(salesDate, start);
    });

    console.log(store.length, 'store length');

    const online = onlineSales.filter((d) => {
      const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);

      return isBefore(salesDate, start);
    });
    console.log(online.length, 'online length');

    const disposed = disposal.filter((d) => {
      const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);

      return isBefore(salesDate, start);
    });
    console.log(disposed.length, 'disposed length');

    // ? start of  supply product
    const dataToFilter = productSupply.filter((d) => {
      const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);

      return isBefore(salesDate, start);
    });
    console.log(dataToFilter.length, 'dataToFilter length');

    const groupedProducts = dataToFilter.reduce((acc: any, product) => {
      const { productId, qty, unitCost, dateX } = product;
      if (!acc[productId]) {
        acc[productId] = []; // Create a new array for the product productId if it doesn't exist
      }
      acc[productId].push({ qty, unitCost, dateX }); // Add the current product to the array
      return acc;
    }, {});
    const groupProductSupply = [];
    for (const key in groupedProducts) {
      const arrays: SupplyProduct[] = groupedProducts[key];

      const formattedArray = arrays.map((item) => {
        const maxDate = max(arrays.map((d) => rearrangeDateString(d.dateX.split(' ')[0])));

        const recentDate = arrays.find(
          (d) => rearrangeDateString(d.dateX.split(' ')[0]) === format(maxDate, 'yyyy-MM-dd')
        );

        return {
          qty: item.qty,
          unitCost: recentDate?.unitCost,
          dateX: item.dateX,
        };
      });
      groupProductSupply.push(...formattedArray);
    }
    const arrayOfSupplies = groupProductSupply.map((d) => Number(d.unitCost) * Number(d.qty));
    // ? end of product supply

    // ? start of offline sales
    const groupStore = store.reduce((acc: any, product) => {
      const { productId, qty, unitPrice, dateX } = product;
      if (!acc[productId]) {
        acc[productId] = []; // Create a new array for the product productId if it doesn't exist
      }
      acc[productId].push({ qty, unitPrice, productId, dateX }); // Add the current product to the array
      return acc;
    }, {});

    const groupProductStore = [];
    for (const key in groupStore) {
      const arrays: StoreSales[] = groupStore[key];

      const formattedArray = arrays.map((item) => {
        const maxDate = max(arrays.map((d) => rearrangeDateString(d.dateX.split(' ')[0])));

        const recentDate = arrays.find(
          (d) => rearrangeDateString(d.dateX.split(' ')[0]) === format(maxDate, 'yyyy-MM-dd')
        );

        return {
          qty: item.qty,
          unitPrice: recentDate?.unitPrice,
          dateX: item.dateX,
        };
      });

      groupProductStore.push(...formattedArray);
    }
    const p = groupProductStore.map((d) => Number(d.unitPrice) * Number(d.qty));

    // ? end of offline sales
    const onlineStore = online.reduce((acc: any, product) => {
      const { productId, qty, unitPrice, dateX } = product;
      if (!acc[productId]) {
        acc[productId] = []; // Create a new array for the product productId if it doesn't exist
      }
      acc[productId].push({ qty, unitPrice, productId, dateX }); // Add the current product to the array
      return acc;
    }, {});
    const onlineProductStore = [];
    for (const key in onlineStore) {
      const arrays: OnlineSale[] = onlineStore[key];

      const formattedArray = arrays.map((item) => {
        const maxDate = max(arrays.map((d) => rearrangeDateString(d.dateX.split(' ')[0])));

        const recentDate = arrays.find(
          (d) => rearrangeDateString(d.dateX.split(' ')[0]) === format(maxDate, 'yyyy-MM-dd')
        );

        return {
          qty: item.qty,
          unitPrice: recentDate?.unitPrice,
          dateX: item.dateX,
        };
      });

      onlineProductStore.push(...formattedArray);
    }
    const onlineArrayNumbers = onlineProductStore.map((d) => Number(d.unitPrice) * Number(d.qty));

    // ? end of online sales

    // ? start of disposal
    const groupDisposed = disposed.reduce((acc: any, product) => {
      const { productId, qty, unitCost, dateX } = product;
      if (!acc[productId]) {
        acc[productId] = []; // Create a new array for the product productId if it doesn't exist
      }
      acc[productId].push({ qty, unitCost, productId, dateX }); // Add the current product to the array
      return acc;
    }, {});

    const groupDisposedStore = [];
    for (const key in groupDisposed) {
      const arrays: DisposedProducts[] = groupDisposed[key];

      const formattedArray = arrays.map((item) => {
        const maxDate = max(arrays.map((d) => rearrangeDateString(d.dateX.split(' ')[0])));

        const recentDate = arrays.find(
          (d) => rearrangeDateString(d.dateX.split(' ')[0]) === format(maxDate, 'yyyy-MM-dd')
        );

        return {
          qty: item.qty,
          unitCost: recentDate?.unitCost,
          dateX: item.dateX,
        };
      });

      groupDisposedStore.push(...formattedArray);
    }
    const disposedProductNumber = groupDisposedStore.map((d) => Number(d.unitCost) * Number(d.qty));

    const total =
      totalAmount(arrayOfSupplies) -
      totalAmount(disposedProductNumber) -
      totalAmount(p) -
      totalAmount(onlineArrayNumbers);

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

    const numbers = dataToFilter?.map((sale) => Number(sale?.dealerShare) * Number(sale?.qty));
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
      return Number(sale?.unitPrice) * Number(sale?.qty);
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

    const numbers = filteredData?.map(
      (padding) => Number(padding?.unitCost) * Number(padding?.qty)
    );

    return totalAmount(numbers);
  }, [productSupply, emptyDates]);

  const memoizedExpense = useMemo(() => {
    if (!expense || emptyDates) return [];
    const expenseDates = expense.filter((d) => {
      const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);
      return isWithinInterval(salesDate, { start: startDate, end: endDate });
    });

    return expenseDates;
  }, [expense, emptyDates, startDate, endDate]);

  const closingStock = useMemo(() => {
    if (!expense || !disposal || !productSupply || emptyDates) return 0;
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');
    const store = storeSales.filter((d) => {
      const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);
      return isBefore(salesDate, start) || isWithinInterval(salesDate, { start, end });
    });

    const online = onlineSales.filter((d) => {
      const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);
      return isBefore(salesDate, start) || isWithinInterval(salesDate, { start, end });
    });

    const disposed = disposal.filter((d) => {
      const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);

      return isBefore(salesDate, start) || isWithinInterval(salesDate, { start, end });
    });

    const dataToFilter = productSupply.filter((d) => {
      const salesDate = rearrangeDateString(d.dateX.split(' ')[0]);
      return isBefore(salesDate, start) || isWithinInterval(salesDate, { start, end });
    });

    const groupedProducts = dataToFilter.reduce((acc: any, product) => {
      const { productId, qty, unitCost, dateX } = product;
      if (!acc[productId]) {
        acc[productId] = []; // Create a new array for the product productId if it doesn't exist
      }
      acc[productId].push({ qty, unitCost, productId, dateX }); // Add the current product to the array
      return acc;
    }, {});
    const groupProductSupply = [];
    for (const key in groupedProducts) {
      const arrays: SupplyProduct[] = groupedProducts[key];

      const formattedArray = arrays.map((item) => {
        const maxDate = max(arrays.map((d) => rearrangeDateString(d.dateX.split(' ')[0])));

        const recentDate = arrays.find(
          (d) => rearrangeDateString(d.dateX.split(' ')[0]) === format(maxDate, 'yyyy-MM-dd')
        );

        return {
          qty: item.qty,
          unitCost: recentDate?.unitCost,
          dateX: item.dateX,
        };
      });
      groupProductSupply.push(...formattedArray);
    }
    const arrayOfSupplies = groupProductSupply.map((d) => Number(d.unitCost) * Number(d.qty));

    const groupStore = store.reduce((acc: any, product) => {
      const { productId, qty, unitPrice, dateX } = product;
      if (!acc[productId]) {
        acc[productId] = []; // Create a new array for the product productId if it doesn't exist
      }
      acc[productId].push({ qty, unitPrice, productId, dateX }); // Add the current product to the array
      return acc;
    }, {});

    const groupProductStore = [];
    for (const key in groupStore) {
      const arrays: StoreSales[] = groupStore[key];

      const formattedArray = arrays.map((item) => {
        const maxDate = max(arrays.map((d) => rearrangeDateString(d.dateX.split(' ')[0])));

        const recentDate = arrays.find(
          (d) => rearrangeDateString(d.dateX.split(' ')[0]) === format(maxDate, 'yyyy-MM-dd')
        );

        return {
          qty: item.qty,
          unitPrice: recentDate?.unitPrice,
          dateX: item.dateX,
        };
      });

      groupProductStore.push(...formattedArray);
    }
    const p = groupProductStore.map((d) => Number(d.unitPrice) * Number(d.qty));

    const onlineStore = online.reduce((acc: any, product) => {
      const { productId, qty, unitPrice, dateX } = product;
      if (!acc[productId]) {
        acc[productId] = []; // Create a new array for the product productId if it doesn't exist
      }
      acc[productId].push({ qty, unitPrice, productId, dateX }); // Add the current product to the array
      return acc;
    }, {});
    const onlineProductStore = [];
    for (const key in onlineStore) {
      const arrays: OnlineSale[] = onlineStore[key];

      const formattedArray = arrays.map((item) => {
        const maxDate = max(arrays.map((d) => rearrangeDateString(d.dateX.split(' ')[0])));

        const recentDate = arrays.find(
          (d) => rearrangeDateString(d.dateX.split(' ')[0]) === format(maxDate, 'yyyy-MM-dd')
        );

        return {
          qty: item.qty,
          unitPrice: recentDate?.unitPrice,
          dateX: item.dateX,
        };
      });

      onlineProductStore.push(...formattedArray);
    }
    const onlineArrayNumbers = onlineProductStore.map((d) => Number(d.unitPrice) * Number(d.qty));
    // ? disposed
    const groupDisposed = disposed.reduce((acc: any, product) => {
      const { productId, qty, unitCost, dateX } = product;
      if (!acc[productId]) {
        acc[productId] = []; // Create a new array for the product productId if it doesn't exist
      }
      acc[productId].push({ qty, unitCost, productId, dateX }); // Add the current product to the array
      return acc;
    }, {});

    const groupDisposedStore = [];
    for (const key in groupDisposed) {
      const arrays: DisposedProducts[] = groupDisposed[key];

      const formattedArray = arrays.map((item) => {
        const maxDate = max(arrays.map((d) => rearrangeDateString(d.dateX.split(' ')[0])));

        const recentDate = arrays.find(
          (d) => rearrangeDateString(d.dateX.split(' ')[0]) === format(maxDate, 'yyyy-MM-dd')
        );

        return {
          qty: item.qty,
          unitCost: recentDate?.unitCost,
          dateX: item.dateX,
        };
      });

      groupDisposedStore.push(...formattedArray);
    }
    const disposedProductNumber = groupDisposedStore.map((d) => Number(d.unitCost) * Number(d.qty));

    const total =
      totalAmount(arrayOfSupplies) -
      totalAmount(disposedProductNumber) -
      totalAmount(p) -
      totalAmount(onlineArrayNumbers);

    return total;
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

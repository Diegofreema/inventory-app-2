/* eslint-disable prettier/prettier */
import { Q } from '@nozbe/watermelondb';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import {
  createAccount,
  createCats,
  createDisposals,
  createExpenses,
  createOnlineSales,
  createProducts,
  createStoreSales,
  createSupply,
  expensesAccount,
  getCat,
  getDisposal,
  getExpenditure,
  getProducts,
  getSale,
  getSalesP,
  getSupply,
} from '../helper';
import { useHasFetched } from '../zustand/useIsFirstTime';
import { useStore } from '../zustand/useStore';

import {
  cartItems,
  categories,
  disposedProducts,
  expenseAccounts,
  expenses,
  onlineSales,
  products,
  saleReferences,
  storeSales,
  supplyProduct,
} from '~/db';
import { useNetwork } from '~/hooks/useNetwork';
import { CatType, InfoType, NotType } from '~/type';

export const useFetchAll = () => {
  const id = useStore((state) => state.id);
  const { hasFetched, setHasFetched } = useHasFetched();

  const [fetching, setFetching] = useState(true);
  const isConnected = useNetwork();
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const [products, online, store, expenses, disposal, account, supply, cats] =
        await Promise.all([
          getProducts(id!),
          getSalesP(id!),
          getSale(id!),
          getExpenditure(id!),
          getDisposal(id!),
          expensesAccount(id!),
          getSupply(id!),
          getCat(),
        ]);

      await createProducts(products);
      await createExpenses(expenses);
      await createAccount(account);
      await createCats(cats);
      await createStoreSales(store);
      await createDisposals(disposal);
      await createOnlineSales(online);
      await createSupply(supply);
      setHasFetched(true);
      setError(null);
    } catch (error) {
      setError('Error fetching and syncing data');
      console.log(error);
    } finally {
      setFetching(false);
    }
  }, []);
  useEffect(() => {
    if (!isConnected) {
      setError('No internet connection, Internet connection needed to sync data');
      return;
    } else {
      setError(null);
    }

    if (hasFetched) return;

    if (id) {
      fetchAll();
    }
  }, [isConnected, id, hasFetched, fetchAll]);

  return { isConnected, fetching, error, fetchAll };
};

export const useProducts = (page?: number) => {
  const offset = page ? (page - 1) * 10 : 0;
  const getProducts = async () => {
    const product = await products
      .query(Q.sortBy('created_at', Q.desc), Q.take(10), Q.skip(offset))
      .fetch();
    const count = await products.query().fetchCount();
    return {
      product,
      count,
    };
  };
  return useQuery({
    queryKey: ['product', page],
    queryFn: getProducts,
    structuralSharing: false,
    placeholderData: (TData) => TData,
  });
};
export const useSalesP = (page?: number) => {
  const offset = page ? (page - 1) * 10 : 0;
  return useQuery({
    queryKey: ['salesPharmacy', page],
    queryFn: async () => {
      const data = await onlineSales
        .query(Q.sortBy('created_at', Q.desc), Q.take(10), Q.skip(offset))
        .fetch();
      const count = await onlineSales.query().fetchCount();
      return { data, count };
    },
    structuralSharing: false,
    placeholderData: (TData) => TData,
  });
};
export const useSalesS = (page?: number) => {
  const offset = page ? (page - 1) * 10 : 0;
  return useQuery({
    queryKey: ['salesStore', page],
    queryFn: async () => {
      const data = await storeSales
        .query(Q.sortBy('created_at', Q.desc), Q.take(10), Q.skip(offset))
        .fetch();
      const count = await storeSales.query().fetchCount();
      return { data, count };
    },
    structuralSharing: false,
    placeholderData: (TData) => TData,
  });
};
export const useExpenditure = (page?: number) => {
  const offset = page ? (page - 1) * 10 : 0;
  const getExpenditure = async () => {
    const data = await expenses.query(Q.sortBy('id', Q.desc), Q.take(10), Q.skip(offset)).fetch();
    const count = await expenses.query().fetchCount();
    return { data, count };
  };

  return useQuery({
    queryKey: ['expenditure'],
    queryFn: () => getExpenditure(),
    structuralSharing: false,
    placeholderData: (TData) => TData,
  });
};
export const useCat = () => {
  const getCat = async () => {
    const data = await categories.query().fetch();

    return data;
  };
  return useQuery<CatType[]>({
    queryKey: ['cat'],
    queryFn: getCat,
    structuralSharing: false,
  });
};
export const useInfo = () => {
  const id = useStore((state) => state.id);
  const getInfo = async () => {
    const { data } = await axios.get(
      `https://247api.netpro.software/api.aspx?api=pharmacyinfor&cidx=${id}`
    );

    return data;
  };
  return useQuery<InfoType>({
    queryKey: ['info', id],
    queryFn: getInfo,
  });
};
export const useSupply = () => {
  const getData = async () => {
    const data = await supplyProduct.query(Q.sortBy('id', Q.desc)).fetch();
    return data;
  };

  return useQuery({
    queryKey: ['supply'],
    queryFn: () => getData(),
    structuralSharing: false,
  });
};
export const useExpAcc = (page?: number) => {
  const offset = page ? (page - 1) * 10 : 0;
  const getExpAcc = async () => {
    const data = await expenseAccounts
      .query(Q.sortBy('created_at', Q.desc), Q.take(10), Q.skip(offset))
      .fetch();
    const count = await expenseAccounts.query().fetchCount();
    return { data, count };
  };
  return useQuery({
    queryKey: ['exp_name', page],
    queryFn: getExpAcc,
    structuralSharing: false,
    placeholderData: (TData) => TData,
  });
};

export const useNotify = () => {
  const id = useStore((state) => state.id);
  const getNot = async () => {
    const response = await axios.get(
      `https://247api.netpro.software/api.aspx?api=get247notification&cidx=${id}`
    );
    let data = [];
    if (Object.prototype.toString.call(response.data) === '[object Object]') {
      data.push(response.data);
    } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
      data = [...response.data];
    }

    return data;
  };
  return useQuery<NotType[]>({
    queryKey: ['not', id],
    queryFn: getNot,
    refetchInterval: 500 * 60,
  });
};
export const useDisposal = () => {
  const getDisposal = async () => {
    const data = await disposedProducts.query(Q.sortBy('id', Q.desc)).fetch();
    return data;
  };
  return useQuery({
    queryKey: ['disposal'],
    queryFn: () => getDisposal(),
    structuralSharing: false,
  });
};

export const useCart = () => {
  const getCart = async () => {
    const data = await cartItems.query().fetch();
    return data;
  };
  return useQuery({
    queryKey: ['cart_items'],
    queryFn: getCart,
    structuralSharing: false,
  });
};
export const useSalesRef = () => {
  const getCart = async () => {
    const data = await saleReferences.query().fetch();
    return data;
  };
  return useQuery({
    queryKey: ['sales_ref'],
    queryFn: getCart,
    structuralSharing: false,
  });
};

export const useCartItemsWithRef = (safeRef: string) => {
  const getCartItem = async () => {
    const salesRefItem = await cartItems.query(Q.where('sales_reference', Q.eq(safeRef))).fetch();

    return salesRefItem;
  };
  return useQuery({
    queryKey: ['cart_item_ref'],
    queryFn: getCartItem,
    structuralSharing: false,
  });
};

/* eslint-disable prettier/prettier */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import {
  api,
  expensesAccount,
  getDisposal,
  getExpenditure,
  getProducts,
  getSale,
  getSalesP,
  getSupply,
} from '../helper';
import { useHasFetched } from '../zustand/useIsFirstTime';
import { useStore } from '../zustand/useStore';

import { useDrizzle } from '~/hooks/useDrizzle';
import { useNetwork } from '~/hooks/useNetwork';
import { CatType, ExpType, InfoType, NotType, SalesP, SalesS, SupplyType } from '~/type';

export const useFetchAll = () => {
  const id = useStore((state) => state.id);
  const { hasFetched, setHasFetched } = useHasFetched();
  const { db, schema } = useDrizzle();
  const [fetching, setFetching] = useState(true);
  const isConnected = useNetwork();
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      console.log('running');

      const [products, online, store, expenses, disposal, account] = await Promise.all([
        getProducts(id!),
        getSalesP(id!),
        getSale(id!),
        getExpenditure(id!),
        getDisposal(id!),
        expensesAccount(id!),
        getSupply(id!),
      ]);
      await Promise.all([
        db.insert(schema.product).values(products),
        db.insert(schema.storeSales).values(store),
        db.insert(schema.expenses).values(expenses),
        db.insert(schema.disposedProducts).values(disposal),
        db.insert(schema.expenseAccount).values(account),
        db.insert(schema.pharmacySales).values(online),
      ]);
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

export const useProducts = () => {
  const id = useStore((state) => state.id);
  const { db, schema } = useDrizzle();
  const getProducts = async () => {
    const response = await axios.get(`${api}api=getproducts&cidx=${id}`);
    let data = [];
    if (Object.prototype.toString.call(response.data) === '[object Object]') {
      data.push(response.data);
    } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
      data = [...response.data];
    }

    const formattedProducts = data.map((product) => ({
      ...product,
      category: product.Category,
      subcategory: product.Subcategory,
    }));
    await db.insert(schema.product).values(formattedProducts).onConflictDoNothing();

    return data;
  };
  return useQuery({
    queryKey: ['product', id],
    queryFn: getProducts,
  });
};
export const useSalesP = () => {
  const id = useStore((state) => state.id);
  const { db, schema } = useDrizzle();
  return useQuery<SalesP[]>({
    queryKey: ['salesPharmacy', id],
    queryFn: async () => {
      const data = await getSalesP(id!);
      await db.insert(schema.pharmacySales).values(data).onConflictDoNothing();
      return data;
    },
  });
};
export const useSalesS = () => {
  const id = useStore((state) => state.id);
  const { db, schema } = useDrizzle();
  return useQuery<SalesS[]>({
    queryKey: ['salesStore', id],
    queryFn: async () => {
      const data = await getSale(id!);
      const previousStoreSales = await db.query.storeSales.findMany();
      data.forEach((d) => {
        if (!previousStoreSales[d.datex]) {
          db.insert(schema.storeSales).values(d).onConflictDoNothing();
        }
      });

      return data;
    },
  });
};
export const useExpenditure = () => {
  const id = useStore((state) => state.id);

  return useQuery<ExpType[]>({
    queryKey: ['expenditure', id],
    queryFn: () => getExpenditure(id),
  });
};
export const useCat = () => {
  const getCat = async () => {
    const response = await axios.get(`${api}api=productcategory`);
    let data = [];
    if (Object.prototype.toString.call(response.data) === '[object Object]') {
      data.push(response.data);
    } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
      data = [...response.data];
    }

    return data;
  };
  return useQuery<CatType[]>({
    queryKey: ['cat'],
    queryFn: getCat,
  });
};
export const useInfo = () => {
  const id = useStore((state) => state.id);
  const getInfo = async () => {
    const { data } = await axios.get(`${api}api=pharmacyinfor&cidx=${id}`);

    return data;
  };
  return useQuery<InfoType>({
    queryKey: ['info', id],
    queryFn: getInfo,
  });
};
export const useSupply = () => {
  const id = useStore((state) => state.id);

  return useQuery<SupplyType[]>({
    queryKey: ['supply', id],
    queryFn: () => getSupply(id),
  });
};
export const useExpAcc = () => {
  const id = useStore((state) => state.id);
  const { db, schema } = useDrizzle();
  const getExpAcc = async () => {
    const response = await axios.get(`${api}api=getexpensact&cidx=${id}`);
    let data: { accountname: string }[] = [];
    if (Object.prototype.toString.call(response.data) === '[object Object]') {
      data.push(response.data);
    } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
      data = [...response.data];
    }

    const previousExpAcc = await db.query.expenseAccount.findMany();
    const previousAccountNames = new Set(previousExpAcc.map((acc) => acc.accountname));

    const newAccounts = data.filter((d) => !previousAccountNames.has(d.accountname));
    console.log(data.length);

    if (newAccounts.length > 0) {
      await db.insert(schema.expenseAccount).values(newAccounts).onConflictDoNothing();
      console.log(`Inserted ${newAccounts.length} new expense accounts`);
    }

    return data;
  };
  return useQuery<{ accountname: string }[]>({
    queryKey: ['exp_name', id],
    queryFn: getExpAcc,
  });
};

export const useNotify = () => {
  const id = useStore((state) => state.id);
  const getNot = async () => {
    const response = await axios.get(`${api}api=get247notification&cidx=${id}`);
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
  const id = useStore((state) => state.id);

  return useQuery<SupplyType[]>({
    queryKey: ['disposal', id],
    queryFn: () => getDisposal(id),
  });
};

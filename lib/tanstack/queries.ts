/* eslint-disable prettier/prettier */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';

import {
  api,
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

import { CartItemWithProductField } from '~/components/CartFlatList';
import { useDrizzle } from '~/hooks/useDrizzle';
import { useNetwork } from '~/hooks/useNetwork';
import { CatType, InfoType, NotType } from '~/type';

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

      await Promise.all([
        db.insert(schema.product).values(products),
        db.insert(schema.storeSales).values(store),
        db.insert(schema.expenses).values(expenses),
        db.insert(schema.disposedProducts).values(disposal),
        db.insert(schema.expenseAccount).values(account),
        db.insert(schema.onlineSale).values(online),
        db.insert(schema.supplyProduct).values(supply),
        db.insert(schema.cart).values({}),
        db.insert(schema.category).values(cats),
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
  const { db } = useDrizzle();
  const getProducts = async () => {
    const products = await db.query.product.findMany({
      orderBy: (product, { desc }) => [desc(product.id)],
    });
    return products;
  };
  return useQuery({
    queryKey: ['product'],
    queryFn: getProducts,
  });
};
export const useSalesP = () => {
  const { db } = useDrizzle();
  return useQuery({
    queryKey: ['salesPharmacy'],
    queryFn: async () => {
      const data = await db.query.onlineSale.findMany({
        with: {
          product: true,
        },
        orderBy: (onlineSale, { desc }) => [desc(onlineSale.id)],
      });
      return data;
    },
  });
};
export const useSalesS = () => {
  const { db } = useDrizzle();
  return useQuery({
    queryKey: ['salesStore'],
    queryFn: async () => {
      const data = await db.query.storeSales.findMany({
        with: {
          product: true,
        },
        orderBy: (storeSales, { desc }) => [desc(storeSales.id)],
      });
      return data;
    },
  });
};
export const useExpenditure = () => {
  const { db } = useDrizzle();
  const getExpenditure = async () => {
    const data = await db.query.expenses.findMany({
      orderBy: (expenses, { desc }) => [desc(expenses.id)],
    });
    return data;
  };

  return useQuery({
    queryKey: ['expenditure'],
    queryFn: () => getExpenditure(),
  });
};
export const useCat = () => {
  const { db } = useDrizzle();
  const getCat = async () => {
    const data = await db.query.category.findMany();

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
  const { db } = useDrizzle();
  const getData = async () => {
    const data = await db.query.supplyProduct.findMany({
      orderBy: (supplyProduct, { desc }) => [desc(supplyProduct.id)],
    });
    return data;
  };

  return useQuery({
    queryKey: ['supply'],
    queryFn: () => getData(),
  });
};
export const useExpAcc = () => {
  const { db } = useDrizzle();
  const getExpAcc = async () => {
    const data = await db.query.expenseAccount.findMany({
      orderBy: (expenseAccount, { desc }) => [desc(expenseAccount.id)],
    });
    return data;
  };
  return useQuery<{ accountName: string }[]>({
    queryKey: ['exp_name'],
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
  const { db } = useDrizzle();

  const getDisposal = async () => {
    const data = await db.query.disposedProducts.findMany();
    return data;
  };
  return useQuery({
    queryKey: ['disposal'],
    queryFn: () => getDisposal(),
  });
};

export const useCart = () => {
  const { db } = useDrizzle();
  const getCart = async () => {
    const data = await db.query.cart.findFirst({
      with: {
        cartItem: true,
      },
    });
    return data;
  };
  return useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });
};
export const useSalesRef = () => {
  const { db } = useDrizzle();
  const getCart = async () => {
    const data = await db.query.salesReference.findMany();
    return data;
  };
  return useQuery({
    queryKey: ['sales_ref'],
    queryFn: getCart,
  });
};

export const useCartItemsWithRef = (safeRef: string) => {
  const { db, schema } = useDrizzle();
  const getCartItem = async (): Promise<CartItemWithProductField[]> => {
    const data = await db.query.cartItem.findMany({
      where: eq(schema.cartItem.salesReference, safeRef),
      with: {
        product: true,
      },
    });
    return data as CartItemWithProductField[];
  };
  return useQuery<CartItemWithProductField[]>({
    queryKey: ['cart_item'],
    queryFn: getCartItem,
  });
};

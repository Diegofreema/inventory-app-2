/* eslint-disable prettier/prettier */

import { useEffect, useState } from 'react';

import { useDrizzle } from './useDrizzle';

import { ProductSelect, SalesP, SalesS } from '~/db/schema';

export const useGet = () => {
  const [products, setProducts] = useState<ProductSelect[] | undefined>([]);
  const [onlineSales, setOnlineSales] = useState<SalesP[]>([]);
  const [storeSales, setStoreSales] = useState<SalesS[]>([]);
  const { db } = useDrizzle();
  useEffect(() => {
    const fetchData = async () => {
      const [p, online, store] = await Promise.all([
        db.query.product.findMany(),
        db.query.PharmacySales.findMany(),
        db.query.StoreSales.findMany(),
      ]);
      setProducts(p);
      setOnlineSales(online);
      setStoreSales(store);
    };

    fetchData();
  }, []);
  return { products, onlineSales, storeSales };
};

/* eslint-disable prettier/prettier */

import { eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';

import { useDrizzle } from './useDrizzle';

import { ProductSelect, SalesP, SalesS, product } from '~/db/schema';

export const useGet = (id?: string) => {
  const [products, setProducts] = useState<ProductSelect[] | undefined>([]);
  const [singleProduct, setSingleProduct] = useState<ProductSelect | undefined>();
  const [onlineSales, setOnlineSales] = useState<SalesP[]>([]);
  const [storeSales, setStoreSales] = useState<SalesS[]>([]);
  const { db } = useDrizzle();
  useEffect(() => {
    const fetchData = async () => {
      const [p, online, store] = await Promise.all([
        db.query.product.findMany(),
        db.query.pharmacySales.findMany(),
        db.query.storeSales.findMany(),
      ]);
      setProducts(p);
      setOnlineSales(online);
      setStoreSales(store);
    };
    const fetchSingleProduct = async () => {
      const p = await db.query.product.findFirst({ where: eq(product.id, id!) });
      setSingleProduct(p);
    };
    fetchData();
    if (id) fetchSingleProduct();
  }, [id]);
  return { products, onlineSales, storeSales, singleProduct };
};

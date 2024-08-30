/* eslint-disable prettier/prettier */

import { eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';

import { useDrizzle } from './useDrizzle';

import { ProductSelect, SalesP, SalesS, product } from '~/db/schema';

export const useGet = (id?: string) => {
  console.log('🚀 ~ useGet ~ id:', id);
  const [products, setProducts] = useState<ProductSelect[] | undefined>([]);
  const [singleProduct, setSingleProduct] = useState<ProductSelect | undefined>();
  const [onlineSales, setOnlineSales] = useState<SalesP[]>([]);
  const [storeSales, setStoreSales] = useState<SalesS[]>([]);

  const { db } = useDrizzle();
  useEffect(() => {
    const fetchData = async () => {
      const [p, online, store] = await Promise.all([
        db.query.product.findMany(),
        db.query.onlineSale.findMany(),
        db.query.storeSales.findMany(),
      ]);
      setProducts(p);
      setOnlineSales(online);
      setStoreSales(store);
    };
    console.log(id, 'id');

    const fetchSingleProduct = async () => {
      if (!id) return;
      const p = await db.query.product.findFirst({ where: eq(product.productId, 'A1197J1938') });
      setSingleProduct(p);
    };
    fetchData();
    if (id) fetchSingleProduct();
  }, [id]);

  return { products, onlineSales, storeSales, singleProduct };
};
export const usePaginatedProducts = () => {
  const [products, setProducts] = useState<ProductSelect[] | undefined>([]);
  const [fetching, setFetching] = useState(false);
  const { db } = useDrizzle();
  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const products = await db.query.product.findMany();

      setProducts(products);
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { products, fetchData, fetching };
};

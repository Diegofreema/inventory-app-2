/* eslint-disable prettier/prettier */

import { eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';

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
export const usePaginatedProducts = (page: number) => {
  const [products, setProducts] = useState<ProductSelect[] | undefined>([]);
  const limit = 5;
  const offset = limit * (page - 1);
  const { db } = useDrizzle();
  useEffect(() => {
    const fetchData = async () => {
      const products = await db.query.product.findMany({
        limit,
        offset,
      });

      setProducts(products);
    };

    fetchData();
  }, [page]);

  return { products };
};

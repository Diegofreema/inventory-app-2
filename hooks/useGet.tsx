/* eslint-disable prettier/prettier */

import { eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';

import { useDrizzle } from './useDrizzle';

import { ProductSelect, SalesP, SalesS, product, staff } from '~/db/schema';

export const useGet = (id?: string, staffId?: number) => {
  console.log('🚀 ~ useGet ~ id:', id);
  const [products, setProducts] = useState<ProductSelect[] | undefined>([]);
  const [singleProduct, setSingleProduct] = useState<ProductSelect | undefined>();
  const [onlineSales, setOnlineSales] = useState<SalesP[]>([]);
  const [storeSales, setStoreSales] = useState<SalesS[]>([]);
  const [worker, setWorker] = useState<{ name: string }>();

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
    const fetchStaff = async () => {
      if (!staffId) return;
      const s = await db.query.staff.findFirst({
        where: eq(staff.id, staffId),
        columns: { name: true },
      });
      setWorker(s);
    };
    const fetchSingleProduct = async () => {
      if (!id) return;
      const p = await db.query.product.findFirst({ where: eq(product.productId, id) });
      setSingleProduct(p);
    };
    fetchData();
    if (id) fetchSingleProduct();
    if (staffId) fetchStaff();
  }, [id, staffId]);

  return { products, onlineSales, storeSales, singleProduct, worker };
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

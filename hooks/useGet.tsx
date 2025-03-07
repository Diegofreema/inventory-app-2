/* eslint-disable prettier/prettier */

import { useCallback, useEffect, useState } from 'react';

import { onlineSales, products, staffs, storeSales } from '~/db';
import OnlineSale from '~/db/model/OnlineSale';
import Product from '~/db/model/Product';
import StoreSales from '~/db/model/StoreSale';

export const useGet = (id?: string, staffId?: string) => {
  const [storedProduct, setStoredProducts] = useState<Product[] | undefined>([]);
  const [singleProduct, setSingleProduct] = useState<Product | undefined>();
  const [online, setOnline] = useState<OnlineSale[]>([]);
  const [storeSale, setStoreSale] = useState<StoreSales[]>([]);
  const [worker, setWorker] = useState<{ name: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const [product, online, store] = await Promise.all([
        products.query().fetch(),
        onlineSales.query().fetch(),
        storeSales.query().fetch(),
      ]);
      setStoredProducts(product);
      setOnline(online);
      setStoreSale(store);
    };

    const fetchStaff = async () => {
      if (!staffId) return;
      const s = await staffs.find(staffId.toString());

      setWorker(s);
    };
    const fetchSingleProduct = async () => {
      if (!id) return;
      try {
        const product = await products.find(id);

        setSingleProduct(product);
      } catch (error) {
        console.log(error);
      }
  };
    fetchData();
    if (id) fetchSingleProduct();
    if (staffId) fetchStaff();
  }, [id, staffId]);

  return { storedProduct, online, storeSale, singleProduct, worker };
};
export const usePaginatedProducts = () => {
  const [product, setProducts] = useState<Product[] | undefined>([]);
  const [fetching, setFetching] = useState(false);

  const fetchData = useCallback(async () => {
    setFetching(true);
    try {
      const pr = await products.query().fetch();

      setProducts(pr);
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { product, fetchData, fetching };
};

/* eslint-disable prettier/prettier */

import { Q } from '@nozbe/watermelondb';
import { useEffect, useState } from 'react';

import { products } from '~/db';

export const useGetProductName = (productId: string) => {
  const [productName, setProductName] = useState('');
  useEffect(() => {
    const fetchProduct = async () => {
      const product = await products.query(Q.where('product_id', productId), Q.take(1)).fetch();
      const singleProductName = product[0]?.product;
      setProductName(singleProductName);
    };
    fetchProduct();
  }, [productId]);
  return productName;
};
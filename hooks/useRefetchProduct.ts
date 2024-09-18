/* eslint-disable prettier/prettier */

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import Product from '~/db/model/Product';
import { getProducts } from '~/lib/helper';
import { useStore } from '~/lib/zustand/useStore';

export const useRefetchProduct = () => {
  const [products, setProducts] = useState<Product[] | undefined>([]);
  const id = useStore((state) => state.id);
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    const getFn = async () => {
      try {
        const data = await queryClient.fetchQuery({
          queryKey: ['products', id],
          queryFn: () => getProducts(id!),
        });
        // @ts-ignore
        setProducts(data);
      } catch (error) {
        console.log(error);
        router.back();
      }
    };
    getFn();
  }, []);

  return products;
};

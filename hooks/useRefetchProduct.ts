/* eslint-disable prettier/prettier */

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { ProductSelect } from '~/db/schema';
import { getProducts } from '~/lib/helper';
import { useStore } from '~/lib/zustand/useStore';

export const useRefetchProduct = () => {
  const [products, setProducts] = useState<ProductSelect[] | undefined>([]);
  const id = useStore((state) => state.id);
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    const getfn = async () => {
      try {
        const data = await queryClient.fetchQuery({
          queryKey: ['products', id],
          queryFn: () => getProducts(id!),
        });

        setProducts(data);
      } catch (error) {
        console.log(error);
        router.back();
      }
    };
    getfn();
  }, []);

  return products;
};

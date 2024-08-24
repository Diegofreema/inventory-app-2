/* eslint-disable prettier/prettier */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

import { api } from '../helper';
import { newProductSchema } from '../validators';
import { useStore } from '../zustand/useStore';

import { SalesStore, SupplyInsert } from '~/type';

export const useAddNewProduct = () => {
  const storeId = useStore((state) => state.id);
  return useMutation({
    mutationFn: async ({
      category,
      state,
      des,
      marketprice,
      online,
      product,
      sellingprice,
      qty,
      sharedealer,
      sharenetpro,
      subcategory,
      customerproductid,
    }: z.infer<typeof newProductSchema>) => {
      const { data } = await axios.get(
        `${api}api=addproduct&customerproductid=${customerproductid}&online=${online}&productname=${product}&cidx=${storeId}&qty=${qty}&statename=${state}&description=${des}&productcategory=${category}&productsubcategory=${subcategory}&marketprice=${marketprice}&getsellingprice=${sellingprice}&getdealershare=${sharedealer}&getnetproshare=${sharenetpro}`
      );

      return data;
    },
  });
};
export const useAdd247 = () => {
  const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, qty }: { qty: string; productId: string }) => {
      const { data } = await axios.get(
        `${api}api=make247sale&cidx=${storeId}&qty=${qty}&productid=${productId}`
      );

      return data;
    },

    onError: () => {
      Toast.show({
        text1: 'Something went wrong',
        text2: 'Failed to add sale',
      });
    },
    onSuccess: (data) => {
      if (data.result === 'done') {
        Toast.show({
          text1: 'Success',
          text2: 'Sales has been added successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['salesPharmacy'] });
      }
    },
  });
};

export const useAddSales = () => {
  const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      qty,
      paymentType,
      salesReference,
      salesRepId,
      transactionInfo,
    }: SalesStore) => {
      const { data } = await axios.get(
        `${api}api=makepharmacysale&cidx=${storeId}&qty=${qty}&productid=${productId}&salesref=${salesReference}&paymenttype=${paymentType}&transactioninfo=${transactionInfo}&salesrepid=${salesRepId}`
      );

      return data;
    },

    onError: () => {
      Toast.show({
        text1: 'Something went wrong',
        text2: 'Failed to add sales',
      });
    },
    onSuccess: (data) => {
      if (data.result === 'done') {
        Toast.show({
          text1: 'Success',
          text2: 'Sales has been added successfully',
        });
        queryClient.invalidateQueries({ queryKey: ['salesStore'] });
      }
    },
  });
};
export const useSupply = () => {
  const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      qty,
      dealerShare,
      netProShare,
      newPrice,
      sellingPrice,
      unitCost,
    }: SupplyInsert) => {
      const { data } = await axios.get(
        `${api}api=addsupply&cidx=${storeId}&productid=${productId}&qty=${qty}&unitcost=${unitCost}&newprice=${newPrice}&getsellingprice=${sellingPrice}&getdealershare=${dealerShare}&getnetproshare=${netProShare}`
      );

      return data;
    },

    onError: (error: Error) => {
      console.log(error?.message);

      Toast.show({
        text1: 'Something went wrong',
        text2: 'Failed to restock product',
      });
    },
    onSuccess: (data) => {
      if (data.result === 'done') {
        Toast.show({
          text1: 'Success',
          text2: 'Product has been restocked',
        });
        queryClient.invalidateQueries({ queryKey: ['product'] });
      }
    },
  });
};
export const useDisposal = () => {
  //   const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, qty }: { qty: string; productId: string }) => {
      const { data } = await axios.get(`${api}api=adddisposal&qty=${qty}&productid=${productId}`);

      return data;
    },

    onError: () => {
      Toast.show({
        text1: 'Something went wrong',
        text2: 'Failed to add product to disposal',
      });
    },
    onSuccess: (data) => {
      console.log(data);

      if (data.result === 'done') {
        Toast.show({
          text1: 'Success',
          text2: 'Product has been disposed',
        });
        queryClient.invalidateQueries({ queryKey: ['product'] });
      }
    },
  });
};
export const useAddAccount = () => {
  const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const { data } = await axios.get(
        `${api}api=addexpenseact&accountname=${name}&cidx=${storeId}`
      );

      return data;
    },

    onError: () => {
      Toast.show({
        text1: 'Something went wrong',
        text2: 'Failed to create expenditure account',
      });
    },
    onSuccess: (data) => {
      Toast.show({
        text1: 'Success',
        text2: 'Expenditure account has been created',
      });
      queryClient.invalidateQueries({ queryKey: ['exp_name'] });
    },
  });
};
export const useAddExp = () => {
  const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      description,
      amount,
      name,
    }: {
      description?: string;
      amount: string;
      name: string;
    }) => {
      const { data } = await axios.get(
        `${api}api=addexpenses&accountname=${name}&cidx=${storeId}&description=${description}&amount=${amount}`
      );

      return data;
    },

    onError: (error) => {
      console.log(error, 'error');

      Toast.show({
        text1: 'Something went wrong',
        text2: 'Failed to add expense to account',
      });
    },
    onSuccess: (data) => {
      console.log('success');
      Toast.show({
        text1: 'Success',
        text2: 'Expense has been added',
      });
      queryClient.invalidateQueries({ queryKey: ['expenditure'] });
    },
  });
};

/* eslint-disable prettier/prettier */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

import { api } from '../helper';
import { newProductSchema } from '../validators';
import { useStore } from '../zustand/useStore';

import { useDrizzle } from '~/hooks/useDrizzle';
import { useNetwork } from '~/hooks/useNetwork';
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
  const { db, schema } = useDrizzle();
  const isConnected = useNetwork();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      try {
        const addedExpense = await db
          .insert(schema.expenseAccount)
          .values({
            accountname: name,
          })
          .returning({ accountname: schema.expenseAccount.accountname });

        if (addedExpense.length && isConnected) {
          try {
            await axios.get(
              `${api}api=addexpenseact&accountname=${addedExpense[0].accountname}&cidx=${storeId}`
            );
          } catch (error) {
            console.log(error);
            await db.insert(schema.expenseAccountOffline).values({
              accountname: name,
            });
          }
        } else if (addedExpense.length && !isConnected) {
          await db.insert(schema.expenseAccountOffline).values({
            accountname: name,
          });
        }

        return addedExpense;
      } catch (error) {
        console.log(error);
      }
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
  const { db, schema } = useDrizzle();
  const isConnected = useNetwork();
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
      const addedExpense = await db
        .insert(schema.expenses)
        .values({
          accountname: name,
          amount,
          descript: description,
          datex: format(Date.now(), 'dd/MM/yyyy HH:mm'),
        })
        .returning();
      if (addedExpense.length && isConnected) {
        await axios.get(
          `${api}api=addexpenses&accountname=${name}&cidx=${storeId}&description=${description}&amount=${amount}`
        );
      } else if (addedExpense.length && !isConnected) {
        await db.insert(schema.expensesOffline).values({
          accountname: name,
          amount,
          descript: description,
          datex: format(Date.now(), 'dd-MM-yyyy HH:mm:ss'),
        });
      } else {
        throw new Error('Failed to add expense');
      }

      return addedExpense;
    },

    onError: (error) => {
      console.log(error.message, 'error');

      Toast.show({
        text1: 'Something went wrong',
        text2: error.message,
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

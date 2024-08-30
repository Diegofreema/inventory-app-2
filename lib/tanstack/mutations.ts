/* eslint-disable prettier/prettier */
import { createId } from '@paralleldrive/cuid2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { eq, sql } from 'drizzle-orm';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

import { api } from '../helper';
import { newProductSchema } from '../validators';
import { useStore } from '../zustand/useStore';

import { CartItemWithProductField } from '~/components/CartFlatList';
import { SalesS } from '~/db/schema';
import { useDrizzle } from '~/hooks/useDrizzle';
import { useNetwork } from '~/hooks/useNetwork';
import { ExtraSalesType, SupplyInsert } from '~/type';

export const useAddNewProduct = () => {
  const storeId = useStore((state) => state.id);
  const isConnected = useNetwork();
  const { db, schema } = useDrizzle();
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
      let productId: string = '';
      let isUnique = false;

      while (!isUnique) {
        productId = createId();
        const existingProduct = await db.query.product.findFirst({
          where: eq(schema.product.productId, productId),
        });

        if (!existingProduct) {
          isUnique = true;
        }
      }
      const addedProduct = await db
        .insert(schema.product)
        .values({
          product,
          qty: +qty,
          category,
          customerProductId: customerproductid,
          marketPrice: +marketprice,
          online: !!online,
          sellingPrice: +sellingprice,
          shareDealer: Number(sharedealer),
          shareNetpro: Number(sharenetpro),
          subcategory,
          productId,
        })
        .returning();
      if (addedProduct.length && isConnected) {
        const { data } = await axios.get(
          `${api}api=addproduct&customerproductid=${customerproductid}&online=${online}&productname=${product}&cidx=${storeId}&qty=${qty}&statename=${state}&description=${des}&productcategory=${category}&productsubcategory=${subcategory}&marketprice=${marketprice}&getsellingprice=${sellingprice}&getdealershare=${sharedealer}&getnetproshare=${sharenetpro}`
        );

        return data;
      } else if (addedProduct.length && !isConnected) {
        const addedProduct = await db
          .insert(schema.productOffline)
          .values({
            product,
            qty: +qty,
            category,
            customerProductId: customerproductid,
            marketPrice: +marketprice,
            online: !!online,
            sellingPrice: +sellingprice,
            shareDealer: Number(sharedealer),
            shareNetpro: Number(sharenetpro),
            subcategory,
            productId,
          })
          .returning();

        return addedProduct;
      } else {
        throw new Error('No internet connection');
      }
    },
  });
};
export const useAdd247 = () => {
  const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
  const { db, schema } = useDrizzle();
  const isConnected = useNetwork();
  return useMutation({
    mutationFn: async ({
      productId,
      qty,
      unitPrice,
    }: {
      qty: string;
      productId: string;
      unitPrice: number;
    }) => {
      try {
        const productInDb = await db.query.product.findFirst({
          where: eq(schema.product.productId, productId),
          columns: {
            shareDealer: true,
            shareNetpro: true,
            productId: true,
          },
        });

        if (!productInDb) return;

        const addedData = await db
          .insert(schema.onlineSale)
          .values({
            // @ts-ignore
            productId: productInDb?.productId,
            dateX: format(Date.now(), 'dd/MM/yyyy HH:mm'),
            qty,
            dealerShare: productInDb?.shareDealer,
            unitPrice: +unitPrice,
            netProShare: productInDb?.shareNetpro,
          })
          .returning();

        if (addedData.length && isConnected) {
          await axios.get(
            `${api}api=make247sale&cidx=${storeId}&qty=${qty}&productid=${productId}`
          );
        } else if (addedData.length && !isConnected) {
          await db.insert(schema.onlineSaleOffline).values({
            // @ts-ignore
            unitPrice: +unitPrice,
            productId: productInDb?.productId,
            qty,
            dateX: format(Date.now(), 'dd/MM/yyyy HH:mm'),
            dealerShare: productInDb?.shareDealer,
            netProShare: productInDb?.shareNetpro,
          });
        } else {
          throw new Error('Something went wrong');
        }

        return addedData;
      } catch (error) {
        console.log(error);
      }
    },

    onError: (error) => {
      console.log(error);

      Toast.show({
        text1: 'Something went wrong',
        text2: error.message,
      });
    },
    onSuccess: (data) => {
      Toast.show({
        text1: 'Success',
        text2: 'Sales has been added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['salesPharmacy'] });
    },
  });
};

export const useCart = () => {
  const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
  const { db, schema } = useDrizzle();
  const isConnected = useNetwork();
  return useMutation({
    mutationFn: async ({
      data,
      extraData,
    }: {
      data: CartItemWithProductField[];
      extraData: ExtraSalesType;
    }) => {
      const productsToAdd: SalesS[] = data.map((item) => ({
        productId: item?.productId!,
        dateX: format(Date.now(), 'dd/MM/yyyy HH:mm'),
        qty: item?.qty,
        paymentType: extraData.paymentType,
        userId: extraData.salesRepId,
        paid: true,
        salesReference: item?.salesReference,
        transInfo: extraData.transactionInfo!,
        unitPrice: item?.product.sellingPrice!,
        cid: item?.product.customerProductId,
      }));
      const addedSales = await db.insert(schema.storeSales).values(productsToAdd).returning();
      queryClient.invalidateQueries({ queryKey: ['salesStore'] });

      if (addedSales.length) {
        await db
          .delete(schema.cartItem)
          .where(eq(schema.cartItem.salesReference, addedSales[0].salesReference));
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        queryClient.invalidateQueries({ queryKey: ['cart_item'] });
        addedSales.forEach(async (item) => {
          await db
            .update(schema.product)
            .set({ qty: sql`${schema.product.qty} - ${item.qty}.00` })
            .where(eq(schema.product.productId, item.productId));
        });
        queryClient.invalidateQueries({ queryKey: ['product'] });

        if (addedSales.length && isConnected) {
          addedSales.forEach(async (item) => {
            const { data } = await axios.get(
              `${api}api=makepharmacysale&cidx=${storeId}&qty=${item.qty}&productid=${item?.productId}&salesref=${item.salesReference}&paymenttype=${extraData.paymentType}&transactioninfo=${extraData.transactionInfo}&salesrepid=${extraData.salesRepId}`
            );

            return data;
          });
        } else if (addedSales && !isConnected) {
          await db.insert(schema.storeSales).values(productsToAdd);
        } else {
          throw new Error('Something went wrong');
        }
      }
    },

    onError: () => {
      Toast.show({
        text1: 'Something went wrong',
        text2: 'Failed to add sales',
      });
    },
    onSuccess: (data) => {
      Toast.show({
        text1: 'Success',
        text2: 'item has been added to cart',
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
export const useAddSales = () => {
  // const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
  const { db, schema } = useDrizzle();

  return useMutation({
    mutationFn: async ({
      productId,
      qty,
      cartId,
      cost,
    }: {
      productId: string;
      qty: number;
      cartId: number;
      cost: number;
    }) => {
      // const { data } = await axios.get(
      //   `${api}api=makepharmacysale&cidx=${storeId}&qty=${qty}&productid=${productId}&salesref=${salesReference}&paymenttype=${paymentType}&transactioninfo=${transactionInfo}&salesrepid=${salesRepId}`
      // );
      let salesref: string = '';

      const salesReference = await db.query.salesReference.findFirst({
        where: eq(schema.salesReference.isActive, true),
        columns: {
          salesReference: true,
        },
      });

      if (salesReference?.salesReference) {
        salesref = salesReference.salesReference;
      } else {
        const newSalesreference = await db
          .insert(schema.salesReference)
          .values({})
          .returning({ salesReference: schema.salesReference.salesReference });
        salesref = newSalesreference[0].salesReference;
      }
      SecureStore.setItem('salesRef', salesref);

      await db.insert(schema.cartItem).values({
        qty,
        productId,
        cartId,
        unitCost: +cost,
        salesReference: salesref,
      });
    },

    onError: () => {
      Toast.show({
        text1: 'Something went wrong',
        text2: 'Failed to add sales',
      });
    },
    onSuccess: (data) => {
      Toast.show({
        text1: 'Success',
        text2: 'item has been added to cart',
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['sales_ref'] });
    },
  });
};
export const useSupply = () => {
  const storeId = useStore((state) => state.id);
  const isConnected = useNetwork();
  const { db, schema } = useDrizzle();
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
      const addedProduct = await db
        .insert(schema.supplyProduct)
        .values({
          // @ts-ignore
          productId,
          datex: format(Date.now(), 'dd/MM/yyyy HH:mm'),
          qty,
          sellingPrice,
          unitCost,
        })
        .returning();
      await db
        .update(schema.product)
        .set({ sellingPrice: +newPrice, qty: sql`${schema.product.qty} + ${qty}` })
        .where(eq(schema.product.id, +productId));
      if (addedProduct.length && isConnected) {
        const { data } = await axios.get(
          `${api}api=addsupply&cidx=${storeId}&productid=${productId}&qty=${qty}&unitcost=${unitCost}&newprice=${newPrice}&getsellingprice=${sellingPrice}&getdealershare=${dealerShare}&getnetproshare=${netProShare}`
        );

        return data;
      } else if (addedProduct.length && !isConnected) {
        const addedProduct = await db
          .insert(schema.supplyProductOffline)
          .values({
            // @ts-ignore
            productId,
            datex: format(Date.now(), 'dd/MM/yyyy HH:mm'),
            qty,
            sellingPrice,
            unitCost,
          })
          .returning();

        return addedProduct;
      } else {
        throw new Error('Something went wrong');
      }
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
        queryClient.invalidateQueries({ queryKey: ['product', 'supply'] });
        queryClient.invalidateQueries({ queryKey: ['supply'] });
      }
    },
  });
};
export const useDisposal = () => {
  //   const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
  const { db, schema } = useDrizzle();
  const isConnected = useNetwork();
  return useMutation({
    mutationFn: async ({
      productId,
      qty,
      unitCost,
    }: {
      qty: string;
      productId: string;
      unitCost: string;
    }) => {
      const disposedProduct = await db
        .insert(schema.disposedProducts)
        .values({
          productId,
          qty: +qty,
          dateX: format(Date.now(), 'dd/MM/yyyy HH:mm'),
          unitCost: +unitCost,
        })
        .returning();

      if (!disposedProduct.length) throw new Error('Failed to dispose product');
      await db
        .update(schema.product)
        .set({ qty: sql`${schema.product.qty} - ${qty}.00` })
        .where(eq(schema.product.id, +productId));

      if (isConnected) {
        const { data } = await axios.get(`${api}api=adddisposal&qty=${qty}&productid=${productId}`);

        return data;
      } else if (!isConnected) {
        const disposedProduct = await db
          .insert(schema.disposedProductsOffline)
          .values({
            productId,
            qty: +qty,
            dateX: format(Date.now(), 'dd/MM/yyyy HH:mm'),
            unitCost: +unitCost,
          })
          .returning();

        await db
          .update(schema.product)
          .set({ qty: sql`${schema.product.qty} - ${qty}` })
          .where(eq(schema.product.id, +productId));
        return disposedProduct;
      } else {
        throw new Error('Something went wrong');
      }
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

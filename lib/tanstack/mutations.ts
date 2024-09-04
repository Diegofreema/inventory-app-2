/* eslint-disable prettier/prettier */
import { createId } from '@paralleldrive/cuid2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

import {
  addAccountName,
  addExpenses,
  addOfflineSales,
  addOnlineSales,
  addProduct,
  createProducts,
  sendDisposedProducts,
  supplyProducts,
} from '../helper';
import { newProductSchema } from '../validators';
import { useStore } from '../zustand/useStore';

import { CartItemWithProductField } from '~/components/CartFlatList';

import { useNetwork } from '~/hooks/useNetwork';
import { ExtraSalesType, SupplyInsert } from '~/type';
import database, { products, supplyProduct } from '~/db';

export const useAddNewProduct = () => {
  const storeId = useStore((state) => state.id);
  const isConnected = useNetwork();

  const queryClient = useQueryClient();
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
      const productId = createId() + Math.random().toString(36).slice(2);
      const createdProduct = await createProducts([
        {
          category,
          description: des,
          marketPrice: +marketprice,
          online,
          product,
          sellingPrice: +sellingprice,
          qty: +qty,
          shareDealer: Number(sharedealer),
          shareNetpro: Number(sharenetpro),
          subcategory,
          customerProductId: customerproductid,
          productId,
        },
      ]);

      console.log(createdProduct);

      // const addedProduct = await db
      //   .insert(schema.product)
      //   .values({
      //     product,
      //     qty: +qty,
      //     category,
      //     customerProductId: customerproductid,
      //     marketPrice: +marketprice,
      //     online: !!online,
      //     sellingPrice: +sellingprice,
      //     shareDealer: Number(sharedealer),
      //     shareNetpro: Number(sharenetpro),
      //     subcategory,
      //     productId,
      //   })
      //   .returning();
      // if (!addedProduct.length) throw Error('Failed to add product');
      // if (isConnected) {
      //   const data = await addProduct({
      //     category,
      //     des,
      //     marketprice,
      //     online,
      //     product,
      //     qty,
      //     sellingprice,
      //     sharedealer,
      //     sharenetpro,
      //     state,
      //     subcategory,
      //     customerproductid,
      //     id: storeId!,
      //   });

      //   return data;
      // } else if (!isConnected) {
      //   const addedProduct = await db
      //     .insert(schema.productOffline)
      //     .values({
      //       product,
      //       qty: +qty,
      //       category,
      //       customerProductId: customerproductid,
      //       marketPrice: +marketprice,
      //       online: !!online,
      //       sellingPrice: +sellingprice,
      //       shareDealer: Number(sharedealer),
      //       shareNetpro: Number(sharenetpro),
      //       subcategory,
      //       productId,
      //     })
      //     .returning();

      //   return addedProduct;
      // }
    },
    onError: (err) => {
      Toast.show({
        text1: 'Failed to add product',
        text2: err.message,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] });
      Toast.show({
        text1: 'Success',
        text2: 'Product has been added successfully',
      });
    },
  });
};
export const useAdd247 = () => {
  const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();

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
      // try {
      //   const productInDb = await db.query.product.findFirst({
      //     where: eq(schema.product.productId, productId),
      //     columns: {
      //       shareDealer: true,
      //       shareNetpro: true,
      //       productId: true,
      //     },
      //   });
      //   if (!productInDb) return;
      //   const addedData = await db
      //     .insert(schema.onlineSale)
      //     .values({
      //       // @ts-ignore
      //       productId: productInDb?.productId,
      //       dateX: format(Date.now(), 'dd/MM/yyyy HH:mm'),
      //       qty: +qty,
      //       dealerShare: productInDb?.shareDealer,
      //       unitPrice: +unitPrice,
      //       netProShare: productInDb?.shareNetpro,
      //     })
      //     .returning();
      //   if (!addedData.length) throw new Error('Failed to add sales');
      //   await db
      //     .update(schema.product)
      //     .set({ qty: sql`${schema.product.qty} - ${qty}` })
      //     .where(eq(schema.product.productId, productId));
      //   if (isConnected) {
      //     try {
      //       await addOnlineSales({
      //         productId: productInDb?.productId,
      //         qty: +qty,
      //         storeId: storeId!,
      //       });
      //     } catch (error) {
      //       console.log(error);
      //       await db.insert(schema.onlineSaleOffline).values({
      //         // @ts-ignore
      //         unitPrice: +unitPrice,
      //         productId: productInDb?.productId,
      //         qty,
      //         dateX: format(Date.now(), 'dd/MM/yyyy HH:mm'),
      //         dealerShare: productInDb?.shareDealer,
      //         netProShare: productInDb?.shareNetpro,
      //       });
      //     }
      //   } else if (addedData.length && !isConnected) {
      //     await db.insert(schema.onlineSaleOffline).values({
      //       // @ts-ignore
      //       unitPrice: +unitPrice,
      //       productId: productInDb?.productId,
      //       qty,
      //       dateX: format(Date.now(), 'dd/MM/yyyy HH:mm'),
      //       dealerShare: productInDb?.shareDealer,
      //       netProShare: productInDb?.shareNetpro,
      //     });
      //   } else {
      //     throw new Error('Something went wrong');
      //   }
      //   return addedData;
      // } catch (error) {
      //   console.log(error);
      // }
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
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
};

export const useCart = () => {
  const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
  const isConnected = useNetwork();
  return useMutation({
    mutationFn: async ({
      data,
      extraData,
    }: {
      data: CartItemWithProductField[];
      extraData: ExtraSalesType;
    }) => {
      // const productsToAdd: SalesS[] = data.map((item) => ({
      //   productId: item?.productId!,
      //   dateX: format(Date.now(), 'dd/MM/yyyy HH:mm'),
      //   qty: item?.qty,
      //   paymentType: extraData.paymentType,
      //   userId: extraData.salesRepId,
      //   paid: true,
      //   salesReference: item?.salesReference,
      //   transInfo: extraData.transactionInfo!,
      //   unitPrice: item?.product.sellingPrice!,
      //   cid: item?.product.customerProductId,
      // }));
      // const addedSales = await db.insert(schema.storeSales).values(productsToAdd).returning();
      // queryClient.invalidateQueries({ queryKey: ['salesStore'] });
      // if (addedSales.length) {
      //   await db
      //     .delete(schema.cartItem)
      //     .where(eq(schema.cartItem.salesReference, addedSales[0].salesReference));
      //   await db
      //     .delete(schema.salesReference)
      //     .where(eq(schema.salesReference.salesReference, addedSales[0].salesReference));
      //   queryClient.invalidateQueries({ queryKey: ['sales_ref'] });
      //   queryClient.invalidateQueries({ queryKey: ['cart'] });
      //   queryClient.invalidateQueries({ queryKey: ['cart_item'] });
      //   addedSales.forEach(async (item) => {
      //     await db
      //       .update(schema.product)
      //       .set({ qty: sql`${schema.product.qty} - ${item.qty}` })
      //       .where(eq(schema.product.productId, item.productId));
      //   });
      //   queryClient.invalidateQueries({ queryKey: ['product'] });
      //   if (addedSales.length && isConnected) {
      //     addedSales.forEach(async ({ id, ...rest }) => {
      //       await addOfflineSales({
      //         ...rest,
      //         storeId: storeId!,
      //         transactionInfo: extraData.transactionInfo!,
      //         salesRepId: extraData.salesRepId,
      //       });
      //       return data;
      //     });
      //   } else if (addedSales && !isConnected) {
      //     await db.insert(schema.storeSalesOffline).values(productsToAdd);
      //   } else {
      //     throw new Error('Something went wrong');
      //   }
      // }
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
        text2: 'Sales has been made',
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
export const useAddSales = () => {
  // const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
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
      //   `https://247api.netpro.software/api.aspx?api=makepharmacysale&cidx=${storeId}&qty=${qty}&productid=${productId}&salesref=${salesReference}&paymenttype=${paymentType}&transactioninfo=${transactionInfo}&salesrepid=${salesRepId}`
      // );
      let salesref: string = '';

      // const salesReference = await db.query.salesReference.findFirst({
      //   where: eq(schema.salesReference.isActive, true),
      //   columns: {
      //     salesReference: true,
      //   },
      // });

      // if (salesReference?.salesReference) {
      //   salesref = salesReference.salesReference;
      // } else {
      //   const newSalesreference = await db
      //     .insert(schema.salesReference)
      //     .values({})
      //     .returning({ salesReference: schema.salesReference.salesReference });
      //   salesref = newSalesreference[0].salesReference;
      // }
      // SecureStore.setItem('salesRef', salesref);

      // await db.insert(schema.cartItem).values({
      //   qty,
      //   productId,
      //   cartId,
      //   unitCost: +cost,
      //   salesReference: salesref,
      // });
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
      const checkIfProductExists = await products.find(productId);
      if (!checkIfProductExists) throw Error('Product does not exist');

      const addedProduct = await database.write(async () => {
        return await supplyProduct.create((supply) => {
          supply.productId = checkIfProductExists.productId;
          supply.qty = qty;
          supply.dateX = format(Date.now(), 'dd/MM/yyyy HH:mm');
          supply.unitCost = Number(newPrice || unitCost);
          supply.isUploaded = true;
        });
      });

      if (!addedProduct) throw Error('Failed to supply product');
      const updatedProduct = await database.write(async () => {
        return await checkIfProductExists.update((product) => {
          product.sellingPrice = +newPrice;
          product.qty = checkIfProductExists.qty + qty;
        });
      });

      if (!updatedProduct) throw Error('Failed to update product');

      if (isConnected) {
        const data = await supplyProducts({
          productId,
          qty,
          dealerShare,
          netProShare,
          newPrice,
          sellingPrice,
          unitCost,
          id: storeId!,
        });
        return data;
      } else if (!isConnected) {
        return await database.write(async () => {
          return await supplyProduct.create((supply) => {
            supply.productId = checkIfProductExists.productId;
            supply.qty = qty;
            supply.dateX = format(Date.now(), 'dd/MM/yyyy HH:mm');
            supply.unitCost = Number(newPrice || unitCost);
            supply.isUploaded = false;
          });
        });
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
      Toast.show({
        text1: 'Success',
        text2: 'Product has been restocked',
      });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['supply'] });
    },
  });
};
export const useDisposal = () => {
  //   const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
  const isConnected = useNetwork();
  return useMutation({
    mutationFn: async ({ productId, qty }: { qty: string; productId: string }) => {
      // const productIsInDb = await db.query.product.findFirst({
      //   where: eq(schema.product.productId, productId),
      // });
      // if (!productIsInDb) throw new Error('Product not found');
      // if (productIsInDb.qty < +qty) throw Error('Not enough stock to dispose');
      // const disposedProduct = await db
      //   .insert(schema.disposedProducts)
      //   .values({
      //     productId: productIsInDb.productId,
      //     qty: +qty,
      //     dateX: format(Date.now(), 'dd/MM/yyyy HH:mm'),
      //     unitCost: productIsInDb.sellingPrice,
      //   })
      //   .returning();
      // if (!disposedProduct.length) throw Error('Failed to dispose product');
      // await db
      //   .update(schema.product)
      //   .set({ qty: sql`${schema.product.qty} - ${qty}` })
      //   .where(eq(schema.product.productId, productIsInDb.productId));
      // if (isConnected) {
      //   const data = await sendDisposedProducts({ qty: +qty, productId });
      //   return data;
      // } else if (!isConnected) {
      //   const disposedProduct = await db
      //     .insert(schema.disposedProductsOffline)
      //     .values({
      //       productId,
      //       qty: +qty,
      //       dateX: format(Date.now(), 'dd/MM/yyyy HH:mm'),
      //       unitCost: productIsInDb.sellingPrice,
      //     })
      //     .returning();
      //   await db
      //     .update(schema.product)
      //     .set({ qty: sql`${schema.product.qty} - ${qty}` })
      //     .where(eq(schema.product.id, +productId));
      //   return disposedProduct;
      // } else {
      //   throw new Error('Something went wrong');
      // }
    },

    onError: (error) => {
      Toast.show({
        text1: 'Something went wrong',
        text2: error.message,
      });
    },
    onSuccess: () => {
      Toast.show({
        text1: 'Success',
        text2: 'Product has been disposed',
      });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
};
export const useAddAccount = () => {
  const storeId = useStore((state) => state.id);
  const isConnected = useNetwork();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      // try {
      //   const addedExpense = await db
      //     .insert(schema.expenseAccount)
      //     .values({
      //       accountName: name,
      //     })
      //     .returning({ accountName: schema.expenseAccount.accountName });
      //   if (addedExpense.length && isConnected) {
      //     try {
      //       await addAccountName({ storeId: storeId!, account: name });
      //     } catch (error) {
      //       console.log(error);
      //       await db.insert(schema.expenseAccountOffline).values({
      //         accountname: name,
      //       });
      //     }
      //   } else if (addedExpense.length && !isConnected) {
      //     await db.insert(schema.expenseAccountOffline).values({
      //       accountname: name,
      //     });
      //   }
      //   return addedExpense;
      // } catch (error) {
      //   console.log(error);
      // }
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
      // const addedExpense = await db
      //   .insert(schema.expenses)
      //   .values({
      //     accountName: name,
      //     amount: +amount,
      //     description,
      //     dateX: format(Date.now(), 'dd/MM/yyyy HH:mm'),
      //   })
      //   .returning();
      // if (addedExpense.length && isConnected) {
      //   try {
      //     await addExpenses({ amount, description, name, storeId: storeId! });
      //   } catch (error) {
      //     console.log(error);
      //     await db.insert(schema.expensesOffline).values({
      //       accountname: name,
      //       amount,
      //       descript: description,
      //       datex: format(Date.now(), 'dd-MM-yyyy HH:mm:ss'),
      //     });
      //   }
      // } else if (addedExpense.length && !isConnected) {
      //   await db.insert(schema.expensesOffline).values({
      //     accountname: name,
      //     amount,
      //     descript: description,
      //     datex: format(Date.now(), 'dd-MM-yyyy HH:mm:ss'),
      //   });
      // } else {
      //   throw new Error('Failed to add expense');
      // }
      // return addedExpense;
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

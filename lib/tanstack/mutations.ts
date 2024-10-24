/* eslint-disable prettier/prettier */
import { Q } from '@nozbe/watermelondb';
import { createId } from '@paralleldrive/cuid2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format, isSameDay, max } from 'date-fns';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

import {
  addAccountName,
  addExpenses,
  addOfflineSales,
  addOnlineSales,
  addProduct,
  createProduct,
  rearrangeDateString,
  sendDisposedProducts,
  supplyProducts,
} from '../helper';
import { newProductSchema } from '../validators';
import { useStore } from '../zustand/useStore';

import database, {
  cartItems,
  disposedProducts,
  expenseAccounts,
  expenses,
  onlineSales,
  products,
  saleReferences,
  storeSales,
  supplyProduct,
  updateProducts,
} from '~/db';
import CartItem from '~/db/model/CartItems';
import { useNetwork } from '~/hooks/useNetwork';
import { ExtraSalesType, SupplyInsert } from '~/type';

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
      qty,
      sharedealer,
      sharenetpro,
      subcategory,
      customerproductid,
      sharePrice,
    }: z.infer<typeof newProductSchema> & { sharePrice: string }) => {
      const shareDealerToNumber = Number(sharedealer);

      const shareNetproToNumber = Number(sharenetpro);
      const marketPriceToNumber = Number(marketprice);
      const sharePriceToNumber = Number(sharePrice);
      const dealerShare = (shareDealerToNumber * marketPriceToNumber) / 100;
      const netProShare = (shareNetproToNumber * marketPriceToNumber) / 100;
      const sellingPrice = (marketPriceToNumber * sharePriceToNumber) / 100;
      const productId = createId() + Math.random().toString(36).slice(2);
      console.log({ sellingPrice, sharePriceToNumber });

      const createdProduct = await createProduct({
        category,
        marketPrice: marketPriceToNumber,
        online,
        product,
        sellingPrice,
        qty: +qty,
        shareDealer: dealerShare,
        shareNetpro: netProShare,
        subcategory,
        customerProductId: customerproductid,
        productId,
      });

      if (!createdProduct) throw Error('Failed to add product');
      if (isConnected) {
        const data = await addProduct({
          category,
          des,
          marketprice,
          online,
          product,
          qty,
          sellingprice: sharePrice,
          sharedealer,
          sharenetpro,
          state,
          subcategory,
          customerproductid,
          id: storeId!,
        });
        console.log({ data });

        if (data?.result) {
          await database.write(async () => {
            await createdProduct.update((product) => {
              product.productId = data?.result;
            });
          });
          return data;
        } else {
          await database.write(async () => {
            await createdProduct.update((product) => {
              product.isUploaded = false;
            });
          });
        }
      } else if (!isConnected) {
        return await database.write(async () => {
          await createdProduct.update((product) => {
            product.isUploaded = false;
          });
        });
      }
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
      qty: number;
      productId: string;
      unitPrice: number;
    }) => {
      try {
        const productInDb = await products.find(productId);
        if (!productInDb) return;
        const addedSales = await database.write(async () => {
          return await onlineSales.create((sale) => {
            sale.productId = productId;
            sale.qty = qty;
            sale.unitPrice = +unitPrice;
            sale.isUploaded = true;
            sale.dateX = format(Date.now(), 'dd/MM/yyyy HH:mm');
            sale.dealerShare = productInDb?.shareDealer;
            sale.unitPrice = +unitPrice;
            sale.netProShare = productInDb?.shareNetpro;
          });
        });

        if (!addedSales) throw new Error('Failed to add sales');
        await database.write(async () => {
          await productInDb.update((product) => {
            product.qty = product.qty - qty;
          });
        });

        try {
          if (isConnected) {
            await addOnlineSales({
              productId: productInDb?.productId,
              qty: +qty,
              storeId: storeId!,
            });
          }
        } catch (error) {
          console.log(error);
          await database.write(async () => {
            await addedSales.update((sale) => {
              sale.isUploaded = false;
            });
          });
        }
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
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });
};

export const useCart = () => {
  const storeId = useStore((state) => state.id);
  const queryClient = useQueryClient();
  const isConnected = useNetwork();
  return useMutation({
    mutationFn: async ({ data, extraData }: { data: CartItem[]; extraData: ExtraSalesType }) => {
      const productsToAdd = data.map((item) => ({
        productId: item?.productId!,
        dateX: format(Date.now(), 'dd/MM/yyyy HH:mm'),
        qty: item?.qty,
        paymentType: extraData.paymentType,
        userId: extraData.salesRepId,
        paid: true,
        salesReference: item?.salesReference,
        transInfo: extraData.transactionInfo!,
        unitPrice: item?.unitCost!,
        cid: '',
        name: item.name,
        id: item.id,
      }));

      const arrayOfAddedSales: { id: string; qty: number; storeId: string }[] = [];
      try {
        await database.write(async () => {
          productsToAdd.forEach(async (item) => {
            const data = await storeSales.create((sale) => {
              sale.productId = item.productId;
              sale.qty = item.qty;
              sale.paymentType = item.paymentType;
              sale.userId = item.userId;
              sale.isPaid = item.paid;
              sale.salesReference = item.salesReference;
              sale.transferInfo = item.transInfo;
              sale.unitPrice = item.unitPrice;
              sale.cid = item.cid;
              sale.dateX = item.dateX;
              sale.isUploaded = true;
            });

            arrayOfAddedSales.push({ id: item.name, qty: item.qty, storeId: data.id });
          });
        });

        queryClient.invalidateQueries({ queryKey: ['salesStore'] });
        queryClient.invalidateQueries({ queryKey: ['sales_ref'] });
        await database.write(async () => {
          const itemsInCart = await cartItems
            .query(Q.where('sales_reference', Q.eq(data[0].salesReference)))
            .fetch();
          itemsInCart.forEach(async (item) => {
            await database.batch(item.prepareDestroyPermanently());
          });
        });
        await database.write(async () => {
          const ref = await saleReferences
            .query(Q.where('sale_reference', Q.eq(data[0].salesReference)))
            .fetch();
          ref.forEach(async (item) => {
            await database.batch(item.prepareDestroyPermanently());
          });
        });
        queryClient.invalidateQueries({ queryKey: ['cart_item_ref'] });
        queryClient.invalidateQueries({ queryKey: ['cart_item'] });

        await database.write(async () => {
          const prods = await products.query().fetch();
          arrayOfAddedSales.forEach(async (item) => {
            prods.forEach(async (prod) => {
              if (prod.product === item.id) {
                await database.write(async () => {
                  await prod.update((product) => {
                    product.qty = product.qty - item.qty;
                  });
                });
              } else {
              }
            });
          });
        });

        if (isConnected) {
          try {
            productsToAdd.forEach(async ({ productId, ...rest }) => {
              const product = await products.find(productId);
              await addOfflineSales({
                ...rest,
                productId: product.productId!,
                storeId: storeId!,
                transactionInfo: extraData.transactionInfo!,
                salesRepId: +extraData.salesRepId,
              });
              return data;
            });
          } catch (error) {
            console.log(error);

            arrayOfAddedSales.forEach(async (item) => {
              const storeSale = await storeSales.find(item.storeId);
              await database.write(async () => {
                await storeSale.update((sale) => {
                  sale.isUploaded = false;
                });
              });
            });
          }
        } else {
          arrayOfAddedSales.forEach(async (item) => {
            const storeSale = await storeSales.find(item.storeId);
            await database.write(async () => {
              await storeSale.update((sale) => {
                sale.isUploaded = false;
              });
            });
          });
        }
        queryClient.invalidateQueries({ queryKey: ['product'] });
      } catch (error) {
        console.log(error);
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
        text2: 'Sales has been made',
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
export const useAddSales = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId,
      qty,
      cost,
      name,
    }: {
      productId: string;
      qty: number;
      cost: number;
      name: string;
    }) => {
      let ref = '';
      console.log('after break point');
      console.log({ productId, qty, cost, name });

      const activeSalesRef = await saleReferences
        .query(Q.where('is_active', true), Q.take(1))
        .fetch();

      if (activeSalesRef.length) {
        ref = activeSalesRef[0].saleReference;
      } else {
        const salesRef = await database.write(async () => {
          return await saleReferences.create((ref) => {
            ref.saleReference = format(Date(), 'dd/MM/yyyy HH:mm') + createId();
            ref.isActive = true;
          });
        });

        ref = salesRef.saleReference;
      }
      console.log({ ref });

      SecureStore.setItem('salesRef', ref);
      await database.write(async () => {
        await cartItems.create((item) => {
          item.productId = productId;
          item.qty = qty;
          item.salesReference = ref;
          item.unitCost = cost;
          item.name = name;
        });
      });
    },

    onError: (error) => {
      console.log(error);

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
      sellingPrice: sharePrice,
      unitCost,
      id,
    }: SupplyInsert) => {
      const checkIfProductExists = await products.find(id);
      if (!checkIfProductExists) throw Error('Product does not exist');
      console.log(checkIfProductExists.productId, productId);

      const addedProduct = await database.write(async () => {
        return await supplyProduct.create((supply) => {
          supply.productId = checkIfProductExists.productId;
          supply.qty = qty;
          supply.dateX = format(Date.now(), 'dd/MM/yyyy HH:mm');
          supply.unitCost = Number(unitCost);
          supply.isUploaded = true;
        });
      });
      const shareNetproToNumber = Number(netProShare);
      const marketPriceToNumber = Number(newPrice);
      const sharePriceToNumber = Number(sharePrice);
      const shareDealerToNumber = Number(dealerShare);
      const dealer = (shareDealerToNumber * marketPriceToNumber) / 100;
      const netPro = (shareNetproToNumber * marketPriceToNumber) / 100;
      const sellingPrice = (marketPriceToNumber * sharePriceToNumber) / 100;
      if (!addedProduct) throw Error('Failed to supply product');
      const updatedProduct = await database.write(async () => {
        return await checkIfProductExists.update((product) => {
          product.marketPrice = +newPrice;
          product.qty = checkIfProductExists.qty + qty;
          product.shareDealer = dealer;
          product.shareNetpro = netPro;
          product.sellingPrice = sellingPrice;
        });
      });

      if (!updatedProduct) throw Error('Failed to update product');

      if (isConnected) {
        console.log(isConnected, 'is connected');
        const data = await supplyProducts({
          productId,
          qty,
          dealerShare,
          netProShare,
          newPrice,
          sellingPrice: sharePrice,
          unitCost,
          id: storeId!,
        });

        return data;
      } else if (!isConnected) {
        return await database.write(async () => {
          return await addedProduct.update((supply) => {
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
        text2: error.message,
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
    mutationFn: async ({ productId, qty, id }: { qty: number; productId: string; id: string }) => {
      try {
        const productInStore = await products.find(id);

        const suppliedProducts = await supplyProduct
          .query(Q.where('product_id', Q.eq(productId)))
          .fetch();

        if (suppliedProducts.length === 0) throw Error('Product does not exist');
        const formattedDateOfProducts = suppliedProducts.map((product) => {
          const productDate = rearrangeDateString(product.dateX.split(' ')[0]);
          return {
            unitCost: product.unitCost,
            dateX: productDate,
            productId: product.productId,
          };
        });
        const mostRecentDate = max(formattedDateOfProducts.map((product) => product.dateX));

        const recentPrice = formattedDateOfProducts
          .filter((product) => {
            const year = Number(product.dateX.split('-')[0]);
            const month = Number(product.dateX.split('-')[1]);
            const day = Number(product.dateX.split('-')[2]);
            const productDate = new Date(year, month - 1, day);
            const recentDate = new Date(
              mostRecentDate.getFullYear(),
              mostRecentDate.getMonth(),
              mostRecentDate.getDate()
            );

            return isSameDay(productDate, recentDate);
          })
          .map((product) => product.unitCost)[0];
        console.log({ recentPrice });

        if (!productInStore) throw Error('Product does not exist');
        if (qty > productInStore.qty) throw Error('Not enough stock to dispose');

        const disposedProduct = await database.write(async () => {
          return await disposedProducts.create((disposedProduct) => {
            disposedProduct.qty = qty;
            disposedProduct.productId = productId;
            disposedProduct.dateX = format(Date.now(), 'dd/MM/yyyy HH:mm');
            disposedProduct.unitCost = recentPrice;
            disposedProduct.isUploaded = true;
          });
        });

        if (!disposedProduct) throw Error('Failed to dispose product');

        const updatedProduct = await database.write(async () => {
          return await productInStore.update((product) => {
            product.qty = productInStore.qty - qty;
          });
        });

        if (!updatedProduct) throw Error('Failed to dispose product');
        if (isConnected) {
          const data = await sendDisposedProducts({
            productId,
            qty,
          });
          return data;
        } else if (!isConnected) {
          await database.write(async () => {
            await disposedProduct.update((product) => {
              product.isUploaded = false;
            });
          });
        }
      } catch (error: any) {
        throw Error(error.message);
      }
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
      try {
        const newAccount = await database.write(async () => {
          return await expenseAccounts.create((account) => {
            account.accountName = name;
            account.isUploaded = true;
          });
        });

        if (!newAccount) throw Error('Failed to create expenditure account');
        if (isConnected) {
          try {
            await addAccountName({ storeId: storeId!, account: name });
          } catch (error) {
            console.log(error);
            await database.write(async () => {
              await newAccount.update((account) => {
                account.isUploaded = false;
              });
            });
          }
        } else if (!isConnected) {
          await database.write(async () => {
            await newAccount.update((account) => {
              account.isUploaded = false;
            });
          });
        }
      } catch (error: any) {
        throw Error(error.message);
      }
    },

    onError: (error) => {
      Toast.show({
        text1: 'Something went wrong',
        text2: error.message,
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
      amount: number;
      name: string;
    }) => {
      try {
        const newExpense = await database.write(async () => {
          return await expenses.create((expense) => {
            expense.accountName = name;
            expense.amount = amount;
            expense.description = description || '';
            expense.isUploaded = true;
            expense.dateX = format(Date.now(), 'dd/MM/yyyy HH:mm');
          });
        });

        if (!newExpense) throw Error('Failed to create expenses');
        if (isConnected) {
          try {
            await addExpenses({ amount: amount.toString(), description, name, storeId: storeId! });
          } catch (error) {
            console.log(error);

            await database.write(async () => {
              await newExpense.update((expense) => {
                expense.isUploaded = false;
              });
            });
          }
        } else if (!isConnected) {
          await database.write(async () => {
            await newExpense.update((expense) => {
              expense.isUploaded = false;
            });
          });
        }
      } catch (error: any) {
        throw Error(error.message);
      }
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
export const usePickUp = () => {
  const storeId = useStore((state) => state.id);
  return useMutation({
    mutationFn: async ({
      ref,
      fee,
      state,
      communityId,
    }: {
      ref: string;
      fee: string;
      state: string;
      communityId: string;
    }) => {
      const { data } = await axios.get(
        `https://247api.netpro.software/api.aspx?api=callforpickup&cidx=${storeId}&salesref=${ref}&customerCommunityID=${communityId}&customerCommunityFee=${fee}&statename=${state}`
      );
      return data;
    },
    onSuccess: (data) => {
      if (data.result === 'done') {
        Toast.show({
          text1: 'Success',
          text2: 'Pickup call has been made',
        });
        router.back();
      } else {
        Toast.show({
          text1: 'Error',
          text2: 'Failed to make pickup call',
        });
      }
    },
    onError: (error) => {
      console.log(error, 'error');

      Toast.show({
        text1: 'Error',
        text2: 'Failed to make pickup call',
      });
    },
  });
};
export const useEdit = () => {
  const isConnected = useNetwork();
  return useMutation({
    mutationFn: async ({
      customerProductId,
      dealerShare,
      netProShare,
      online,
      price,
      productId,
      qty,
      sellingPrice,
    }: {
      qty: string;
      customerProductId: string;
      online: string;
      price: string;
      sellingPrice: string;
      dealerShare: string;
      netProShare: string;
      productId: string;
    }) => {
      if (isConnected) {
        await axios.get(
          `https://247api.netpro.software/api.aspx?api=updateproductpricenqty&qty=${qty}&customerproductid=${customerProductId}&online=${online}&price=${price}&getsellingprice=${sellingPrice}&getdealershare=${dealerShare}&getnetproshare=${netProShare}&productid=${productId}`
        );
      } else {
        await database.write(async () => {
          const product = await products
            .query(Q.where('product_id', Q.eq(productId)), Q.take(1))
            .fetch();
          const singleProduct = product[0];
          await updateProducts.create((p) => {
            p.product = singleProduct.product;
            p.productId = singleProduct.productId;
            p.customerProductId = customerProductId;
            p.marketPrice = +price;
            p.qty = +qty;
            p.sellingPrice = +sellingPrice;
            p.shareDealer = +dealerShare;
            p.shareNetpro = +netProShare;
          });
        });
      }
    },
    onSuccess: () => {
      Toast.show({
        text1: 'Success',
        text2: 'Product updated',
      });
    },
    onError: (error) => {
      console.log(error, 'error');

      Toast.show({
        text1: 'Error',
        text2: 'Failed to update product',
      });
    },
  });
};

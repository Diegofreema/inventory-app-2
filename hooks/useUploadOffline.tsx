/* eslint-disable prettier/prettier */

import { Q } from "@nozbe/watermelondb";

import { useNetwork } from "./useNetwork";

import database, {
  disposedProducts,
  expenseAccounts,
  expenses as expensesDb,
  onlineSales,
  products as productsDb,
  storeSales,
  supplyProduct
} from "~/db";
import { useReCompute } from "~/hooks/useRecomputate";
import {
  addAccountName,
  addExpenses,
  addOfflineSales,
  addOnlineSales,
  addProduct,
  sendDisposedProducts,
  supplyProducts as supplyProductsOffline,
  totalAmount,
  uploadPrice,
  uploadQty
} from "~/lib/helper";
import {
  useDisposeOffline,
  useExpenseAccountOffline,
  useExpenseOffline,
  useOnlineOffline,
  useProductOffline,
  useStoreOffline,
  useStoreQty,
  useSupplyOffline,
  useUpdateOnlineStatus,
  useUpdatePrice
} from "~/lib/tanstack/offline";
import { useInfo } from "~/lib/tanstack/queries";
import { useProductUpdateQty } from "~/lib/zustand/updateProductQty";
import { useProductUpdatePrice } from "~/lib/zustand/useProductUpdatePrice";
import { useStore } from "~/lib/zustand/useStore";

/* eslint-disable prettier/prettier */
export const useUploadOffline = () => {
  const storeOfflinePrice = useProductUpdatePrice((state) => state.offlineProducts);
  const deleteOfflinePrice = useProductUpdatePrice((state) => state.removeProduct);
  const storeOfflineQty = useProductUpdateQty((state) => state.offlineProducts);
  const deleteOfflineQty = useProductUpdateQty((state) => state.removeProduct);

  const id = useStore((state) => state.id);
  const { data } = useInfo();
  const info = data?.[0];

  return async () => {
    const [supply, dispose, products, accounts, expenses, store, online] = await Promise.all([
      supplyProduct.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
      disposedProducts.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
      productsDb.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
      expenseAccounts.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
      expensesDb.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
      storeSales.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
      onlineSales.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
    ]);
    if (!id || !data) return;
    if (products.length) {
      const uploadPromises = products.map(async (item) => {
        try {
          const [supplyProducts, disposed, sales] = await Promise.all([
            supplyProduct.query(Q.where('product_id', Q.eq(item.productId))).fetch(),
            disposedProducts.query(Q.where('product_id', Q.eq(item.productId))).fetch(),
            storeSales.query(Q.where('product_id', Q.eq(item.productId))).fetch()
          ]);const data = await addProduct({
            product: item.product,
            category: item.category ?? '', // Use nullish coalescing instead of !
            state: info?.stateName ?? '',
            id,
            des: item.description,
            marketprice: item.marketPrice?.toString() ?? '0',
            online: !!item.online,
            qty: item.qty.toString(),
            sellingprice: item.sellingPrice?.toString() ?? '0',
            sharedealer: info?.shareSeller,
            sharenetpro: info?.shareNetpro,
            subcategory: item.subcategory ?? '',
            customerproductid: item.customerProductId ?? '',
          });

          // First database write
          await database.write(async () => {
            await database.batch(
              item.prepareUpdate((product) => {
                product.isUploaded = true;
                product.productId = data?.result;
              })
            );
          });

          // Second database write
          await database.write(async () => {


            console.log(supplyProducts.length, disposed.length, sales.length, 'second' +
              ' database write');

            await database.batch([
              ...supplyProducts.map((supplyProduct) =>
                supplyProduct.prepareUpdate((s) => {
                  s.productId = data.result;
                })
              ),
              ...disposed.map((des) =>
                des.prepareUpdate((d) => {
                  d.productId = data.result;
                })
              ),
              ...sales.map((s) =>
                s.prepareUpdate((sale) => {
                  sale.productId = data.result;
                })
              )
            ]);
          });
        } catch (error) {
          console.error('Error processing product:', item.product, error);
          throw error; // Re-throw to ensure Promise.all fails if any upload fails
        }
      });

      await Promise.all(uploadPromises);
    }


    if (accounts.length) {
      try {
        await Promise.all(
          accounts.map(async (item) => {
            await addAccountName({
              storeId: id!,
              account: item.accountName,
            });
            await database.write(async () => {
              await database.batch(item.prepareUpdate((i) => (i.isUploaded = true)));
            });
          })
        );
      } catch (e) {
        console.log('Failed to upload account', e);
      }
    }

    if (expenses.length) {
      await Promise.all(
        expenses.map(async (item) => {
          await addExpenses({
            storeId: id!,
            name: item.accountName,
            amount: item.amount.toString(),
            description: item.description!,
          });
          await database.write(async () => {
            await database.batch(item.prepareUpdate((i) => (i.isUploaded = true)));
          });
        })
      );
    }

    if (online.length) {
      try {
        await Promise.all(
          online.map(async (item) => {
            await addOnlineSales({
              ...item,
              storeId: id!,
            });
            await database.write(async () => {
              await database.batch(item.prepareUpdate((i) => (i.isUploaded = true)));
            });
          })
        );
      } catch (e) {
        console.log(e, 'Error uploading online');
      }
    }
    if (supply.length) {
      try {
        await Promise.all(
          supply.map(async (item) => {
            await supplyProductsOffline({
              productId: item.productId,
              qty: item.qty,
              dealerShare: info?.shareSeller!,
              netProShare: info?.shareNetpro!,
              unitCost: item.unitCost?.toString(),
              newPrice: item?.newPrice?.toString()!,
              sellingPrice: item.unitCost?.toString()!,
              id,
            });
            await database.write(async () => {
              await database.batch(item.prepareUpdate((i) => (i.isUploaded = true)));
            });
          })
        );
      } catch (e) {
        console.error(e);
      }
    }
    if (dispose.length) {
      try {
        await Promise.all(
          dispose.map(async (item) => {
            await sendDisposedProducts({
              productId: item.productId,
              qty: item.qty,
            });
            await database.write(async () => {
              await database.batch(item.prepareUpdate((i) => (i.isUploaded = true)));
            });
          })
        );
      } catch (e) {
        console.log(e, 'failed to upload disposed items');
      }
    }
    if (store.length) {
      try {
        await Promise.all(
          store.map(async (item) => {
            await addOfflineSales({
              qty: item.qty,
              productId: item.productId,
              paymentType: item.paymentType,
              salesReference: item.salesReference,
              storeId: id!,
              transactionInfo: item.transferInfo!,
              salesRepId: +item.userId,
            });

            await database.write(async () => {
              await database.batch(item.prepareUpdate((item) => (item.isUploaded = true)));
            });
          })
        );
      } catch (e) {
        console.log(e, 'Error uploading offline sales');
      }
    }
    uploadPrice(storeOfflinePrice, deleteOfflinePrice);
    uploadQty(storeOfflineQty, deleteOfflineQty);
  };
};

export const useOfflineNumber = () => {
  const isConnected = useNetwork();
  const { reload } = useReCompute();
  const { data, isPending, isError: isErrorQty } = useStoreQty(isConnected, reload);
  const {
    data: dataPrice,
    isPending: isPendingQuantity,
    isError: isErrorQuantity,
  } = useUpdatePrice(isConnected, reload);
  const { data: store, isPending: isPendingStore, isError } = useStoreOffline(isConnected, reload);
  const {
    data: online,
    isPending: isPendingOnline,
    isError: isErr,
  } = useOnlineOffline(isConnected, reload);
  const {
    data: expenseAccount,
    isPending: isPendingAccount,
    isError: isErrorAccount,
  } = useExpenseAccountOffline(isConnected, reload);
  const {
    data: expense,
    isPending: isPendingExpense,
    isError: isE,
  } = useExpenseOffline(isConnected, reload);
  const {
    data: onlineStatus,
    isPending: isPendingStatus,
    isError: isErrorStatus,
  } = useUpdateOnlineStatus(isConnected, reload);
  const {
    data: products,
    isPending: isPendingProducts,
    isError: isErrorProducts,
  } = useProductOffline(isConnected, reload);
  const {
    data: supply,
    isPending: isPendingSupply,
    isError: isErrorSupply,
  } = useSupplyOffline(isConnected, reload);
  const {
    data: disposed,
    isPending: isPendingDisposed,
    isError: isErrorDisposed,
  } = useDisposeOffline(isConnected, reload);
  if (
    isError ||
    isErr ||
    isErrorAccount ||
    isE ||
    isErrorDisposed ||
    isErrorProducts ||
    isErrorSupply ||
    isErrorQty ||
    isErrorQuantity ||
    isErrorStatus
  ) {
    return 0;
  }
  if (
    isPendingDisposed ||
    isPendingAccount ||
    isPendingSupply ||
    isPendingProducts ||
    isPendingExpense ||
    isPendingOnline ||
    isPendingStore ||
    isPendingQuantity ||
    isPending ||
    isPendingStatus
  ) {
    return 0;
  }
  const total = [
    data,
    dataPrice,
    store,
    online,
    expense,
    expenseAccount,
    products,
    supply,
    disposed,
    onlineStatus,
  ];

  return totalAmount(total);
};

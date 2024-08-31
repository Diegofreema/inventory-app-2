/* eslint-disable prettier/prettier */

import { eq } from 'drizzle-orm';
import { useEffect } from 'react';

import { useDrizzle } from './useDrizzle';
import { useNetwork } from './useNetwork';

import {
  addAccountName,
  addExpenses,
  addOfflineSales,
  addOnlineSales,
  addProduct,
  supplyProducts,
} from '~/lib/helper';
import { useInfo } from '~/lib/tanstack/queries';
import { useStore } from '~/lib/zustand/useStore';

/* eslint-disable prettier/prettier */
export const useUploadOffline = () => {
  const isConnected = useNetwork();
  const { db, schema } = useDrizzle();
  const id = useStore((state) => state.id);
  const { data } = useInfo();
  useEffect(() => {
    const upload = async () => {
      const [supply, dispose, products, accounts, expenses, store, online] = await Promise.all([
        db.query.supplyProductOffline.findMany(),
        db.query.disposedProductsOffline.findMany(),
        db.query.productOffline.findMany(),
        db.query.expenseAccountOffline.findMany(),
        db.query.expensesOffline.findMany(),
        db.query.storeSalesOffline.findMany(),
        db.query.onlineSaleOffline.findMany(),
      ]);
      if (!id || !data) return;
      if (supply.length) {
        supply.forEach(async (item) => {
          supplyProducts({
            productId: item.productId,
            qty: item.qty.toString(),
            dealerShare: data.shareseller,
            netProShare: data.sharenetpro,
            unitCost: item.unitCost?.toString(),
            newPrice: item?.unitCost?.toString()!,
            sellingPrice: item.unitCost?.toString()!,
            id,
          }).then(async () => {
            await db
              .delete(schema.supplyProductOffline)
              .where(eq(schema.supplyProductOffline.id, item.id));
          });
        });
      }
      if (dispose.length) {
        dispose.forEach(async (item) => {
          supplyProducts({
            productId: item.productId,
            qty: item.qty.toString(),
            dealerShare: data.shareseller,
            netProShare: data.sharenetpro,
            unitCost: item.unitCost?.toString(),
            newPrice: item?.unitCost?.toString()!,
            sellingPrice: item.unitCost?.toString()!,
            id,
          }).then(async () => {
            await db
              .delete(schema.disposedProductsOffline)
              .where(eq(schema.disposedProductsOffline.id, item.id));
          });
        });
      }
      if (products.length) {
        products.forEach(async (item) => {
          addProduct({
            product: item.product,
            category: item.category!,
            state: data.statename,
            id,
            des: item.description!,
            marketprice: item.marketPrice?.toString()!,
            online: !!item.online,
            qty: item.qty.toString(),
            sellingprice: item.sellingPrice?.toString()!,
            sharedealer: data.shareseller,
            sharenetpro: data.sharenetpro,
            subcategory: item.subcategory!,
            customerproductid: item.customerProductId!,
          }).then(async () => {
            await db.delete(schema.productOffline).where(eq(schema.productOffline.id, item.id));
          });
        });
      }

      if (accounts.length) {
        accounts.forEach(async (item) => {
          addAccountName({ storeId: id!, account: item.accountname }).then(async () => {
            await db
              .delete(schema.expenseAccountOffline)
              .where(eq(schema.expenseAccountOffline.id, item.id));
          });
        });
      }
      if (expenses.length) {
        expenses.forEach(async (item) => {
          addExpenses({
            storeId: id!,
            name: item.accountname,
            amount: item.amount,
            description: item.descript!,
          }).then(async () => {
            await db.delete(schema.expensesOffline).where(eq(schema.expensesOffline.id, item.id));
          });
        });
      }

      if (online.length) {
        online.forEach(async ({ id: d, ...item }) => {
          addOnlineSales({
            ...item,
            storeId: id!,
          }).then(async () => {
            await db.delete(schema.onlineSaleOffline).where(eq(schema.onlineSaleOffline.id, d));
          });
        });
      }

      if (store.length) {
        store.forEach(async ({ id: d, ...item }) => {
          addOfflineSales({
            ...item,
            storeId: id!,
            transactionInfo: item.transferInfo!,
            salesRepId: item.userId!,
          }).then(async () => {
            await db.delete(schema.storeSalesOffline).where(eq(schema.storeSalesOffline.id, d));
          });
        });
      }
    };

    if (isConnected) upload();
  }, [isConnected, id, data]);
};

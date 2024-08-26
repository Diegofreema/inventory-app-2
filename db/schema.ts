/* eslint-disable prettier/prettier */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const product = sqliteTable('products', {
  id: text('id').notNull().primaryKey(),
  Category: text('category').notNull(),
  Subcategory: text('subcategory').notNull(),
  customerproductid: text('customer_product_id'),
  marketprice: text('market_price'),
  online: text('online'),
  product: text('product').notNull(),
  qty: text('qty').notNull(),
  sellingprice: text('seller_price'),
  sharedealer: text('share_dealer'),
  sharenetpro: text('share_netpro'),
});

export const staff = sqliteTable('staff', {
  id: integer('id').notNull().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
});

export type ProductSelect = typeof product.$inferSelect;
export type ProductInsert = typeof product.$inferInsert;
export type StaffInsert = typeof staff.$inferInsert;
export type StaffSelect = typeof staff.$inferSelect;

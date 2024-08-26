/* eslint-disable prettier/prettier */

import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const product = sqliteTable('products', {
  id: text('id').notNull().primaryKey(),
  category: text('category').notNull(),
  subcategory: text('subcategory').notNull(),
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

export const PharmacySales = sqliteTable('pharmacy_sales', {
  id: integer('id').notNull().primaryKey(),
  productid: text('product_id')
    .notNull()
    .references(() => product.id),
  qty: text('qty').notNull(),
  unitprice: text('unit_price').notNull(),
  datex: text('date').notNull(),
  dealershare: text('dealer_share').notNull(),
  netproshare: text('netpro_share').notNull(),
});

export const pharmacySalesRelation = relations(PharmacySales, ({ one }) => ({
  product: one(product),
}));

export const StoreSales = sqliteTable('store_sales', {
  id: integer('id').notNull().primaryKey(),
  productid: text('product_id')
    .notNull()
    .references(() => product.id),
  datex: text('date').notNull(),
  unitprice: text('unit_price').notNull(),
  qty: text('qty').notNull(),
  salesreference: text('sales_reference').notNull(),
  paymenttype: text('payment_type').notNull(),
  transinfo: text('trans_info').notNull(),
  paid: text('paid').notNull(),
  userid: integer('user_id')
    .notNull()
    .references(() => staff.id),
  cid: text('cid'),
});
export const storeSalesRelation = relations(StoreSales, ({ one }) => ({
  product: one(product),
}));

export const storeStaffRelation = relations(StoreSales, ({ one }) => ({
  staff: one(staff),
}));
export const ExpenseAccount = sqliteTable('expense_account', {
  id: integer('id').notNull().primaryKey(),
  accountname: text('account_name').notNull(),
});
export const Expenses = sqliteTable('expenses', {
  id: integer('id').notNull().primaryKey(),
  accountname: text('account_name').notNull(),
  datex: text('date').notNull(),
  descript: text('description'),
  amount: text('amount').notNull(),
});

export const Category = sqliteTable('categories', {
  id: integer('id').notNull().primaryKey(),
  category: text('category').notNull(),
  subcategory: text('subcategory').notNull(),
});

export const PharmacyInfo = sqliteTable('pharmacy_info', {
  id: integer('id').notNull().primaryKey(),
  statename: text('state_name').notNull(),
  businessname: text('business_name').notNull(),
  shareseller: text('share_seller').notNull(),
  sharenetpro: text('share_netpro').notNull(),
  shareprice: text('share_price').notNull(),
});

export const supplyProduct = sqliteTable('supply_product', {
  id: integer('id').notNull().primaryKey(),
  productid: text('product_id')
    .notNull()
    .references(() => product.id),
  qty: text('qty').notNull(),
  unitcost: text('unit_cost').notNull(),
  datex: text('date').notNull(),
});
export const supplyRelation = relations(supplyProduct, ({ one }) => ({
  product: one(product),
}));
export type supplyProductSelect = typeof supplyProduct.$inferSelect;
export type supplyProductInsert = typeof supplyProduct.$inferInsert;

export type CategorySelect = typeof Category.$inferSelect;
export type CategoryInsert = typeof Category.$inferInsert;
export type PharmacyType = typeof PharmacyInfo.$inferInsert;
export type PharmacySelect = typeof PharmacyInfo.$inferSelect;
export type ExpenseInsert = typeof Expenses.$inferInsert;
export type ExpenseSelect = typeof Expenses.$inferSelect;

export type SalesP = typeof PharmacySales.$inferInsert;
export type SalesPSelect = typeof PharmacySales.$inferSelect;
export type SalesS = typeof StoreSales.$inferInsert;
export type SalesSSelect = typeof StoreSales.$inferSelect;
export type ProductSelect = typeof product.$inferSelect;
export type ProductInsert = typeof product.$inferInsert;
export type StaffInsert = typeof staff.$inferInsert;
export type StaffSelect = typeof staff.$inferSelect;

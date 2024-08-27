/* eslint-disable prettier/prettier */

import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const product = sqliteTable('products', {
  id: text('id').notNull().primaryKey(),
  category: text('category'),
  subcategory: text('subcategory'),
  customerproductid: text('customer_product_id'),
  marketprice: text('market_price'),
  online: text('online'),
  product: text('product').notNull(),
  qty: text('qty').notNull(),
  sellingprice: text('seller_price'),
  sharedealer: text('share_dealer'),
  sharenetpro: text('share_netpro'),
});
export const productOffline = sqliteTable('products_offline', {
  id: text('id').notNull().primaryKey(),
  category: text('category'),
  subcategory: text('subcategory'),
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
  pharmacyId: text('pharmacy_id'),
});

export const pharmacySales = sqliteTable('pharmacy_sales', {
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
export const pharmacySalesOffline = sqliteTable('pharmacy_sales_offline', {
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

export const pharmacySalesRelation = relations(pharmacySales, ({ one }) => ({
  product: one(product, {
    fields: [pharmacySales.productid],
    references: [product.id],
  }),
}));

export const storeSales = sqliteTable('store_sales', {
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
export const disposedProducts = sqliteTable('disposed_products', {
  id: integer('id').notNull().primaryKey(),
  productid: text('product_id')
    .notNull()
    .references(() => product.id),
  qty: text('qty').notNull(),
  datex: text('date').notNull(),
});
export const disposedProductsOffline = sqliteTable('disposed_products_offline', {
  id: integer('id').notNull().primaryKey(),
  productid: text('product_id')
    .notNull()
    .references(() => product.id),
  qty: text('qty').notNull(),
  datex: text('date').notNull(),
});

export const storeSalesOffline = sqliteTable('store_sales_offline', {
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
export const storeSalesRelation = relations(storeSales, ({ one }) => ({
  product: one(product, {
    fields: [storeSales.productid],
    references: [product.id],
  }),
}));

export const storeStaffRelation = relations(storeSales, ({ one }) => ({
  staff: one(staff),
}));
export const expenseAccount = sqliteTable('expense_account', {
  id: integer('id').notNull().primaryKey(),
  accountname: text('account_name').notNull(),
});
export const expenseAccountOffline = sqliteTable('expense_account_offline', {
  id: integer('id').notNull().primaryKey(),
  accountname: text('account_name').notNull(),
});
export const expenses = sqliteTable('expenses', {
  id: integer('id').notNull().primaryKey(),
  accountname: text('account_name').notNull(),
  datex: text('date').notNull(),
  descript: text('description'),
  amount: text('amount').notNull(),
});
export const expensesOffline = sqliteTable('expenses_offline', {
  id: integer('id').notNull().primaryKey(),
  accountname: text('account_name').notNull(),
  datex: text('date').notNull(),
  descript: text('description'),
  amount: text('amount').notNull(),
});

export const category = sqliteTable('categories', {
  id: integer('id').notNull().primaryKey(),
  category: text('category').notNull(),
  subcategory: text('subcategory').notNull(),
});
export const categoryOffline = sqliteTable('categories_offline', {
  id: integer('id').notNull().primaryKey(),
  category: text('category').notNull(),
  subcategory: text('subcategory').notNull(),
});

export const pharmacyInfo = sqliteTable('pharmacy_info', {
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
export const supplyProductOffline = sqliteTable('supply_product', {
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
export type DisposedSelect = typeof disposedProducts.$inferSelect;
export type CategorySelect = typeof category.$inferSelect;
export type CategoryInsert = typeof category.$inferInsert;
export type PharmacyType = typeof pharmacyInfo.$inferInsert;
export type PharmacySelect = typeof pharmacyInfo.$inferSelect;
export type ExpenseInsert = typeof expenses.$inferInsert;
export type ExpenseSelect = typeof expenses.$inferSelect;
export type ExpenseAccount = typeof expenseAccount.$inferSelect;

export type SalesP = typeof pharmacySales.$inferInsert;
export type SalesPSelect = typeof pharmacySales.$inferSelect;
export type SalesPInsert = typeof pharmacySales.$inferInsert;
export type SalesS = typeof storeSales.$inferInsert;
export type SalesSSelect = typeof storeSales.$inferSelect;
export type ProductSelect = typeof product.$inferSelect;
export type ProductInsert = typeof product.$inferInsert;
export type StaffInsert = typeof staff.$inferInsert;
export type StaffSelect = typeof staff.$inferSelect;

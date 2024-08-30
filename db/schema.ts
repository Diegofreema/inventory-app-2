/* eslint-disable prettier/prettier */

import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const product = sqliteTable('products', {
  id: integer('id').notNull().primaryKey(),
  productId: text('product_id').notNull(),
  category: text('category'),
  subcategory: text('subcategory'),
  customerProductId: text('customer_product_id'),
  marketPrice: integer('market_price', { mode: 'number' }),
  online: integer('online', { mode: 'boolean' }),
  product: text('product').notNull(),
  qty: integer('qty').notNull(),
  sellingPrice: integer('seller_price', { mode: 'number' }),
  shareDealer: integer('share_dealer', { mode: 'number' }),
  shareNetpro: integer('share_netpro', { mode: 'number' }),
});
export const productOffline = sqliteTable('products_offline', {
  id: integer('id').notNull().primaryKey(),
  productId: text('product_id').notNull(),
  category: text('category'),
  subcategory: text('subcategory'),
  customerProductId: text('customer_product_id'),
  marketPrice: integer('market_price', { mode: 'number' }),
  online: integer('online', { mode: 'boolean' }),
  product: text('product').notNull(),
  qty: integer('qty').notNull(),
  sellingPrice: integer('seller_price', { mode: 'number' }),
  shareDealer: integer('share_dealer', { mode: 'number' }),
  shareNetpro: integer('share_netpro', { mode: 'number' }),
});

export const staff = sqliteTable('staff', {
  id: integer('id').notNull().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  pharmacyId: text('pharmacy_id'),
  // isAdmin: integer('is_admin', { mode: 'boolean' }).default(false),
});

export const onlineSale = sqliteTable('online_sales', {
  id: integer('id').notNull().primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => product.productId),
  qty: integer('qty').notNull(),
  unitPrice: integer('unit_price', { mode: 'number' }).notNull(),
  dateX: text('date').notNull(),
  dealerShare: integer('dealer_share', { mode: 'number' }).notNull(),
  netProShare: integer('netpro_share', { mode: 'number' }).notNull(),
});
export const onlineSaleOffline = sqliteTable('online_sales_offline', {
  id: integer('id').notNull().primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => product.productId),
  qty: integer('qty').notNull(),
  unitPrice: integer('unit_price', { mode: 'number' }).notNull(),
  dateX: text('date').notNull(),
  dealerShare: text('dealer_share').notNull(),
  netProShare: text('netpro_share').notNull(),
});

export const onlineSaleRelation = relations(onlineSale, ({ one }) => ({
  product: one(product, {
    fields: [onlineSale.productId],
    references: [product.productId],
  }),
}));

export const disposedProducts = sqliteTable('disposed_products', {
  id: integer('id').notNull().primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => product.productId),
  qty: integer('qty').notNull(),
  dateX: text('date').notNull(),
  unitCost: integer('unit_cost', { mode: 'number' }),
});
export const disposedProductsOffline = sqliteTable('disposed_products_offline', {
  id: integer('id').notNull().primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => product.productId),
  qty: integer('qty').notNull(),
  dateX: text('date').notNull(),
  unitCost: integer('unit_cost', { mode: 'number' }),
});
export const storeSales = sqliteTable('store_sales', {
  id: integer('id').notNull().primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => product.productId),
  dateX: text('date').notNull(),
  unitPrice: integer('unit_price', { mode: 'number' }).notNull(),
  qty: integer('qty').notNull(),
  salesReference: text('sales_reference').notNull(),
  paymentType: text('payment_type').notNull(),
  transferInfo: text('trans_info'),
  paid: integer('paid', { mode: 'boolean' }).default(true),
  userId: integer('user_id').references(() => staff.id),
  cid: text('cid'),
});
export const storeSalesOffline = sqliteTable('store_sales_offline', {
  id: integer('id').notNull().primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => product.productId),
  dateX: text('date').notNull(),
  unitPrice: integer('unit_price', { mode: 'number' }).notNull(),
  qty: integer('qty').notNull(),
  salesReference: text('sales_reference').notNull(),
  paymentType: text('payment_type'),
  transferInfo: text('trans_info'),
  paid: integer('paid', { mode: 'boolean' }).default(true),
  userId: integer('user_id').references(() => staff.id),
  cid: text('cid'),
});
export const storeSalesRelation = relations(storeSales, ({ one }) => ({
  product: one(product, { fields: [storeSales.productId], references: [product.productId] }),
}));

export const storeStaffRelation = relations(storeSales, ({ one }) => ({
  staff: one(staff),
}));
export const expenseAccount = sqliteTable('expense_account', {
  id: integer('id').notNull().primaryKey(),
  accountName: text('account_name').notNull(),
});
export const expenseAccountOffline = sqliteTable('expense_account_offline', {
  id: integer('id').notNull().primaryKey(),
  accountname: text('account_name').notNull(),
});
export const expenses = sqliteTable('expenses', {
  id: integer('id').notNull().primaryKey(),
  accountName: text('account_name').notNull(),
  dateX: text('date').notNull(),
  description: text('description'),
  amount: integer('amount', { mode: 'number' }).notNull(),
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
  productId: text('product_id')
    .notNull()
    .references(() => product.productId),
  qty: integer('qty').notNull(),
  unitCost: integer('unit_cost', { mode: 'number' }),

  dateX: text('date'),
});
export const supplyProductOffline = sqliteTable('supply_product_offline', {
  id: integer('id').notNull().primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => product.productId),
  qty: integer('qty').notNull(),
  unitCost: integer('unit_cost', { mode: 'number' }),

  dateX: text('date'),
});
export const supplyRelation = relations(supplyProduct, ({ one }) => ({
  product: one(product, {
    fields: [supplyProduct.productId],
    references: [product.productId],
  }),
}));
export const cart = sqliteTable('cart', {
  id: integer('id').notNull().primaryKey(),
});

export const salesReference = sqliteTable('sales_reference', {
  id: integer('id').notNull().primaryKey(),
  salesReference: text('sales_reference')
    .notNull()
    .$default(() => createId() + sql`CURRENT_TIMESTAMP`),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
});

export const cartItem = sqliteTable('cart_item', {
  id: integer('id').notNull().primaryKey(),
  productId: text('product_id').references(() => product.productId),
  qty: integer('qty').notNull(),
  cartId: integer('cart_id').references(() => cart.id),
  unitCost: integer('unit_cost').notNull(),
  salesReference: text('sales_reference').notNull(),
});
export const cartItemProduct = relations(cartItem, ({ one }) => ({
  product: one(product, {
    fields: [cartItem.productId],
    references: [product.productId],
  }),
}));
export const cartCartItemRelation = relations(cart, ({ many }) => ({
  cartItem: many(cartItem),
}));
export const cartItemCartRelation = relations(cartItem, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItem.cartId],
    references: [cart.id],
  }),
}));
export type supplyProductSelect = typeof supplyProduct.$inferSelect;
export type supplyOffline = typeof supplyProductOffline.$inferSelect;
export type supplyOfflineInsert = typeof supplyProductOffline.$inferInsert;
export type supplyProductInsert = typeof supplyProduct.$inferInsert;
export type SalesRefType = typeof salesReference.$inferInsert;
export type SalesRefSelect = typeof salesReference.$inferSelect;
export type DisposedSelect = typeof disposedProducts.$inferSelect;
export type CategorySelect = typeof category.$inferSelect;
export type CategoryInsert = typeof category.$inferInsert;
export type PharmacyType = typeof pharmacyInfo.$inferInsert;
export type PharmacySelect = typeof pharmacyInfo.$inferSelect;
export type ExpenseInsert = typeof expenses.$inferInsert;
export type ExpenseSelect = typeof expenses.$inferSelect;
export type ExpenseAccount = typeof expenseAccount.$inferSelect;
export type CartSelect = typeof cart.$inferSelect;
export type CartItemSelect = typeof cartItem.$inferSelect;
export type SalesP = typeof onlineSale.$inferInsert;
export type SalesPSelect = typeof onlineSale.$inferSelect;
export type SalesPInsert = typeof onlineSale.$inferInsert;
export type SalesS = typeof storeSales.$inferInsert;
export type SalesSSelect = typeof storeSales.$inferSelect;
export type ProductSelect = typeof product.$inferSelect;
export type ProductInsert = typeof product.$inferInsert;
export type StaffInsert = typeof staff.$inferInsert;
export type StaffSelect = typeof staff.$inferSelect;

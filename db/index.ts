import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Platform } from 'react-native';

// import migrations from './migration';
import CartItem from './model/CartItems';
import Categories from './model/Category';
import DisposedProducts from './model/DisposedProducts';
import ExpenseAccount from './model/ExpenseAccount';
import Expenses from './model/Expenses';
import OnlineSale from './model/OnlineSale';
import PharmacyInfo from './model/Phamarcy';
import Product from './model/Product';
import SaleReference from './model/SalesReference';
import Staff from './model/Staff';
import StoreSales from './model/StoreSale';
import SupplyProduct from './model/SupplyProduct';
import schema from './schema';

const adapter = new SQLiteAdapter({
  schema,

  //   migrations,

  jsi: Platform.OS === 'ios',

  onSetUpError: (error) => {
    console.log(error);
  },
});

const database = new Database({
  adapter,
  modelClasses: [
    Product,
    Staff,
    OnlineSale,
    DisposedProducts,
    StoreSales,
    ExpenseAccount,
    Expenses,
    Categories,
    PharmacyInfo,
    SupplyProduct,
    SaleReference,

    CartItem,
  ],
});

export default database;
export const products = database.get<Product>('products');
export const staffs = database.get<Staff>('staffs');
export const onlineSales = database.get<OnlineSale>('online_sales');
export const storeSales = database.get<StoreSales>('store_sales');
export const disposedProducts = database.get<DisposedProducts>('disposed_products');
export const expenseAccounts = database.get<ExpenseAccount>('expense_accounts');
export const expenses = database.get<Expenses>('expenses');
export const categories = database.get<Categories>('categories');
export const pharmacyInfo = database.get<PharmacyInfo>('pharmacy_info');
export const supplyProduct = database.get<SupplyProduct>('supply_products');
export const saleReferences = database.get<SaleReference>('sale_references');

export const cartItems = database.get<CartItem>('cart_items');

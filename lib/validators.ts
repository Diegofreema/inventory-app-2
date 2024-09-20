/* eslint-disable prettier/prettier */
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Please enter your email',
      invalid_type_error: 'Please enter a valid email',
    })
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Please enter your email address' }),
  password: z
    .string({ required_error: 'Please enter your password' })
    .min(1, { message: 'Password must be at least 5 characters long' }),
});
export const addStaffSchema = z
  .object({
    name: z.string().min(1, { message: 'Full name is required' }),

    email: z
      .string({
        required_error: 'Please enter your email',
        invalid_type_error: 'Please enter a valid email',
      })
      .min(1, { message: 'Please enter your email' })
      .email({ message: 'Please enter your email address' }),
    password: z
      .string({ required_error: 'Please enter  password' })
      .min(1, { message: 'Password must be at least 5 characters long' }),
    confirmPassword: z
      .string({ required_error: 'Please enter confirm password' })
      .min(1, { message: 'Password must be at least 5 characters long' }),
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/, {
    //   message:
    //     'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    // }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });
export const expenseSchema = z.object({
  accountName: z
    .string({
      required_error: 'Account name is required',
      invalid_type_error: 'Account name is required',
    })
    .min(1, { message: 'Account name is required' }),
  amount: z
    .string({ required_error: 'Amount is required' })
    .min(1, { message: 'Amount is required' }),
  description: z.string().optional(),

  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/, {
  //   message:
  //     'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  // }),
});
export const expenditureSchema = z.object({
  accountName: z
    .string({
      required_error: 'Account name is required',
      invalid_type_error: 'Account name is required',
    })
    .min(1, { message: 'Account name is required' }),

  // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/, {
  //   message:
  //     'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  // }),
});

export const newProductSchema = z.object({
  product: z.string().min(1, { message: 'Product Name is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  state: z.string().optional(),
  des: z.string().min(1, { message: 'Description is required' }),
  marketprice: z.string().min(1, { message: 'Price is required' }),
  online: z.boolean(),
  sellingprice: z.string().min(1, { message: 'Selling price is required' }),
  qty: z.string().min(1, { message: 'Quantity is required' }),
  sharedealer: z.string().optional(),
  sharenetpro: z.string().optional(),
  subcategory: z.string().min(1, { message: 'Subcategory is required' }),
  customerproductid: z.string().optional(),
});
export const productSupplySchema = z.object({
  product: z.string().min(1, { message: 'Product Name is required' }),
  unitPrice: z.string().optional(),
  newPrice: z.string().min(1, { message: 'Price is required' }),
  qty: z.string().min(1, { message: 'Quantity is required' }),
});
export const pharmacySales = z.object({
  qty: z.string().min(1, { message: 'Quantity is required' }),
  productName: z.string().min(1, { message: 'Product name is required' }),
});
export const storeSales = z.object({
  qty: z.string().min(1, { message: 'Quantity is required' }),
  productName: z.string().min(1, { message: 'Product name is required' }),
  salesReference: z.string().min(1, { message: "Sale's reference is required" }),
  paymentType: z.string().min(1, { message: 'Payment type is required' }),
});
export const addToCart = z.object({
  qty: z.string().min(1, { message: 'Quantity is required' }),
  productId: z.string().min(1, { message: 'Product name is required' }),
});
export const disposeSchema = z.object({
  qty: z.string().min(1, { message: 'Quantity is required' }),
  productName: z.string().min(1, { message: 'Product name is required' }),
});
export const extraDataSchema = z.object({
  transferInfo: z.string().optional(),
  paymentType: z.enum(['Cash', 'Card', 'Transfer']),
});

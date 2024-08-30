CREATE TABLE `cart` (
	`id` integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cart_item` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text,
	`qty` integer NOT NULL,
	`cart_id` integer,
	`unit_cost` integer NOT NULL,
	`sales_reference` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`subcategory` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `categories_offline` (
	`id` integer PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`subcategory` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `disposed_products` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`qty` integer NOT NULL,
	`date` text NOT NULL,
	`unit_cost` integer,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `disposed_products_offline` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`qty` integer NOT NULL,
	`date` text NOT NULL,
	`unit_cost` integer,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `expense_account` (
	`id` integer PRIMARY KEY NOT NULL,
	`account_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `expense_account_offline` (
	`id` integer PRIMARY KEY NOT NULL,
	`account_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY NOT NULL,
	`account_name` text NOT NULL,
	`date` text NOT NULL,
	`description` text,
	`amount` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `expenses_offline` (
	`id` integer PRIMARY KEY NOT NULL,
	`account_name` text NOT NULL,
	`date` text NOT NULL,
	`description` text,
	`amount` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `online_sales` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`qty` integer NOT NULL,
	`unit_price` integer NOT NULL,
	`date` text NOT NULL,
	`dealer_share` integer NOT NULL,
	`netpro_share` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `online_sales_offline` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`qty` integer NOT NULL,
	`unit_price` integer NOT NULL,
	`date` text NOT NULL,
	`dealer_share` text NOT NULL,
	`netpro_share` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pharmacy_info` (
	`id` integer PRIMARY KEY NOT NULL,
	`state_name` text NOT NULL,
	`business_name` text NOT NULL,
	`share_seller` text NOT NULL,
	`share_netpro` text NOT NULL,
	`share_price` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`category` text,
	`subcategory` text,
	`customer_product_id` text,
	`market_price` integer,
	`online` integer,
	`product` text NOT NULL,
	`qty` integer NOT NULL,
	`seller_price` integer,
	`share_dealer` integer,
	`share_netpro` integer
);
--> statement-breakpoint
CREATE TABLE `products_offline` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`category` text,
	`subcategory` text,
	`customer_product_id` text,
	`market_price` integer,
	`online` integer,
	`product` text NOT NULL,
	`qty` integer NOT NULL,
	`seller_price` integer,
	`share_dealer` integer,
	`share_netpro` integer
);
--> statement-breakpoint
CREATE TABLE `sales_reference` (
	`id` integer PRIMARY KEY NOT NULL,
	`sales_reference` text NOT NULL,
	`is_active` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`pharmacy_id` text
);
--> statement-breakpoint
CREATE TABLE `store_sales` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`date` text NOT NULL,
	`unit_price` integer NOT NULL,
	`qty` integer NOT NULL,
	`sales_reference` text NOT NULL,
	`payment_type` text NOT NULL,
	`trans_info` text,
	`paid` integer DEFAULT true,
	`user_id` integer,
	`cid` text,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `store_sales_offline` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`date` text NOT NULL,
	`unit_price` integer NOT NULL,
	`qty` integer NOT NULL,
	`sales_reference` text NOT NULL,
	`payment_type` text,
	`trans_info` text,
	`paid` integer DEFAULT true,
	`user_id` integer,
	`cid` text,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `supply_product` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`qty` integer NOT NULL,
	`unit_cost` integer,
	`date` text,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `supply_product_offline` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`qty` integer NOT NULL,
	`unit_cost` integer,
	`date` text,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action
);

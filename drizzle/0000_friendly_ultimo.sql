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
	`qty` text NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `disposed_products_offline` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`qty` text NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
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
	`amount` text NOT NULL
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
CREATE TABLE `pharmacy_info` (
	`id` integer PRIMARY KEY NOT NULL,
	`state_name` text NOT NULL,
	`business_name` text NOT NULL,
	`share_seller` text NOT NULL,
	`share_netpro` text NOT NULL,
	`share_price` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pharmacy_sales` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`qty` text NOT NULL,
	`unit_price` text NOT NULL,
	`date` text NOT NULL,
	`dealer_share` text NOT NULL,
	`netpro_share` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pharmacy_sales_offline` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`qty` text NOT NULL,
	`unit_price` text NOT NULL,
	`date` text NOT NULL,
	`dealer_share` text NOT NULL,
	`netpro_share` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY NOT NULL,
	`category` text,
	`subcategory` text,
	`customer_product_id` text,
	`market_price` text,
	`online` text,
	`product` text NOT NULL,
	`qty` text NOT NULL,
	`seller_price` text,
	`share_dealer` text,
	`share_netpro` text
);
--> statement-breakpoint
CREATE TABLE `products_offline` (
	`id` integer PRIMARY KEY NOT NULL,
	`category` text,
	`subcategory` text,
	`customer_product_id` text,
	`market_price` text,
	`online` text,
	`product` text NOT NULL,
	`qty` text NOT NULL,
	`seller_price` text,
	`share_dealer` text,
	`share_netpro` text
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
	`unit_price` text NOT NULL,
	`qty` text NOT NULL,
	`sales_reference` text NOT NULL,
	`payment_type` text NOT NULL,
	`trans_info` text NOT NULL,
	`paid` text NOT NULL,
	`user_id` integer NOT NULL,
	`cid` text,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `store_sales_offline` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`date` text NOT NULL,
	`unit_price` text NOT NULL,
	`qty` text NOT NULL,
	`sales_reference` text NOT NULL,
	`payment_type` text NOT NULL,
	`trans_info` text NOT NULL,
	`paid` text NOT NULL,
	`user_id` integer NOT NULL,
	`cid` text,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `supply_product` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`qty` text NOT NULL,
	`unit_cost` text NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);

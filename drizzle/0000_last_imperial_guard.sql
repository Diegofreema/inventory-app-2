CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text,
	`subcategory` text,
	`customer_product_id` text,
	`market_price` text,
	`online` text,
	`product` text,
	`qty` text,
	`seller_price` text,
	`share_dealer` text,
	`share_netpro` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);

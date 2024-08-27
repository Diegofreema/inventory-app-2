CREATE TABLE `disposed_products` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`qty` text NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);

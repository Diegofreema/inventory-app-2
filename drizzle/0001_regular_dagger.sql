CREATE TABLE `cart` (
	`id` integer PRIMARY KEY NOT NULL,
	`sales_reference` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cart_item` (
	`id` integer PRIMARY KEY NOT NULL,
	`product_id` text,
	`qty` integer NOT NULL,
	`cart_id` integer,
	`unit_cost` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON UPDATE no action ON DELETE no action
);

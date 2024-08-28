ALTER TABLE `cart_item` ADD `sales_reference` text NOT NULL;--> statement-breakpoint
ALTER TABLE `cart` DROP COLUMN `sales_reference`;
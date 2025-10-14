-- AlterTable
ALTER TABLE `booking` ADD COLUMN `paymentRedirectUrl` TEXT NULL,
    ADD COLUMN `paymentToken` TEXT NULL;

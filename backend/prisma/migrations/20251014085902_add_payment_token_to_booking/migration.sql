/*
  Warnings:

  - You are about to drop the column `paymentRedirectUrl` on the `booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentToken]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `paymentRedirectUrl`,
    MODIFY `paymentToken` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_paymentToken_key` ON `Booking`(`paymentToken`);

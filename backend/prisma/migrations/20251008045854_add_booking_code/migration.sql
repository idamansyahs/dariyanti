/*
  Warnings:

  - A unique constraint covering the columns `[bookingCode]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `bookingCode` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_bookingCode_key` ON `Booking`(`bookingCode`);

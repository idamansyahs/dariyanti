/*
  Warnings:

  - A unique constraint covering the columns `[midtransOrderId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `booking` ADD COLUMN `midtransOrderId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_midtransOrderId_key` ON `Booking`(`midtransOrderId`);

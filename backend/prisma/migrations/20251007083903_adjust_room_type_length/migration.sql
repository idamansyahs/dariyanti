/*
  Warnings:

  - The values [BOUTIQUE,SS] on the enum `Booking_roomType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `type` on the `room` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE `booking` MODIFY `roomType` ENUM('FBK', 'FSKG', 'FSST', 'DXQ') NOT NULL;

-- AlterTable
ALTER TABLE `room` MODIFY `type` VARCHAR(255) NOT NULL;

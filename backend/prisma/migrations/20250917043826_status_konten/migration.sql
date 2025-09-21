/*
  Warnings:

  - You are about to alter the column `platform` on the `konten` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(4))`.

*/
-- AlterTable
ALTER TABLE `konten` MODIFY `platform` ENUM('Instagram', 'Tiktok') NOT NULL DEFAULT 'Instagram';

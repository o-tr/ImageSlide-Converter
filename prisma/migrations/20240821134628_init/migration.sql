/*
  Warnings:

  - You are about to drop the column `key` on the `file` table. All the data in the column will be lost.
  - Added the required column `fileId` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `file` DROP COLUMN `key`,
    ADD COLUMN `fileId` VARCHAR(191) NOT NULL;

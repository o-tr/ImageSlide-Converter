/*
  Warnings:

  - You are about to drop the column `fileSize` on the `file` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `file` DROP COLUMN `fileSize`,
    ADD COLUMN `totalSize` INTEGER NOT NULL DEFAULT 0;

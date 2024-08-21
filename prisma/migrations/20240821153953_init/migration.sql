/*
  Warnings:

  - A unique constraint covering the columns `[fileId]` on the table `file` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `file_fileId_key` ON `file`(`fileId`);

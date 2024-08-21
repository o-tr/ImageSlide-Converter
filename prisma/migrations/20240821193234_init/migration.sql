-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `file_userId_fkey`;

-- AlterTable
ALTER TABLE `file` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

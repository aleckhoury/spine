/*
  Warnings:

  - You are about to alter the column `position` on the `ListItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "ListItem" ALTER COLUMN "position" SET DEFAULT 1000000,
ALTER COLUMN "position" SET DATA TYPE INTEGER;

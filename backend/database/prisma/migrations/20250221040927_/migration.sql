/*
  Warnings:

  - You are about to drop the column `overview` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `synopsis` on the `Book` table. All the data in the column will be lost.
  - The `image` column on the `Book` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `isbn` on table `Book` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "overview",
DROP COLUMN "synopsis",
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "description" TEXT,
ADD COLUMN     "mainCategory" TEXT,
ADD COLUMN     "subtitle" TEXT,
ALTER COLUMN "isbn" SET NOT NULL,
DROP COLUMN "image",
ADD COLUMN     "image" JSONB;

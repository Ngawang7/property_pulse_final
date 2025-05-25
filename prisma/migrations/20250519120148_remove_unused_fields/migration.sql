/*
  Warnings:

  - You are about to drop the column `amenities` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `baths` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `beds` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `rates` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `squareFeet` on the `Property` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "amenities",
DROP COLUMN "baths",
DROP COLUMN "beds",
DROP COLUMN "rates",
DROP COLUMN "squareFeet";

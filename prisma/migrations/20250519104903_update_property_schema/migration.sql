/*
  Warnings:

  - You are about to drop the column `bathrooms` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `bedrooms` on the `Property` table. All the data in the column will be lost.
  - Added the required column `baths` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beds` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listingType` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerEmail` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerName` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerPhone` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "bathrooms",
DROP COLUMN "bedrooms",
ADD COLUMN     "baths" INTEGER NOT NULL,
ADD COLUMN     "beds" INTEGER NOT NULL,
ADD COLUMN     "listingType" TEXT NOT NULL,
ADD COLUMN     "sellerEmail" TEXT NOT NULL,
ADD COLUMN     "sellerName" TEXT NOT NULL,
ADD COLUMN     "sellerPhone" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `userId` on the `permissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[barberId,permission]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barberId` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_userId_fkey";

-- DropIndex
DROP INDEX "permissions_userId_permission_key";

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "userId",
ADD COLUMN     "barberId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "permissions_barberId_permission_key" ON "permissions"("barberId", "permission");

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "barbers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

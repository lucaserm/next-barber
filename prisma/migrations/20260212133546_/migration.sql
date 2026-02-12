/*
  Warnings:

  - You are about to drop the column `barberId` on the `permissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,permission]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_barberId_fkey";

-- DropIndex
DROP INDEX "permissions_barberId_permission_key";

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "barberId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "permissions_userId_permission_key" ON "permissions"("userId", "permission");

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "DocumentType" ADD VALUE 'AVATAR';

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "userId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Document_userId_key" ON "Document"("userId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

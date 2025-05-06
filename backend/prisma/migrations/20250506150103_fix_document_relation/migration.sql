/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "messageId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Document_messageId_key" ON "Document"("messageId");

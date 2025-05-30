/*
  Warnings:

  - A unique constraint covering the columns `[stripeSessionId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSessionId]` on the table `Quote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoiceLink` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeSessionId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeSessionId` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Checkpoint" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Freelance" ADD COLUMN     "stripeAccountId" TEXT;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "invoiceLink" TEXT NOT NULL,
ADD COLUMN     "stripeSessionId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "devisLink" TEXT,
ADD COLUMN     "stripeSessionId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_stripeSessionId_key" ON "Invoice"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Quote_stripeSessionId_key" ON "Quote"("stripeSessionId");

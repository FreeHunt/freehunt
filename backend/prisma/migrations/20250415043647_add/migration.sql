/*
  Warnings:

  - A unique constraint covering the columns `[normalizedName]` on the table `Skills` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `normalizedName` to the `Skills` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Skills" ADD COLUMN     "aliases" TEXT[],
ADD COLUMN     "normalizedName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Skills_normalizedName_key" ON "Skills"("normalizedName");

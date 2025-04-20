/*
  Warnings:

  - Added the required column `location` to the `Freelance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seniority` to the `Freelance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Freelance" ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "seniority" INTEGER NOT NULL;

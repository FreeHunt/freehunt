/*
  Warnings:

  - Added the required column `jobTitle` to the `Freelance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Freelance" ADD COLUMN     "jobTitle" TEXT NOT NULL;

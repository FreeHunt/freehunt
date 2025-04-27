/*
  Warnings:

  - Added the required column `averageDailyRate` to the `JobPosting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seniority` to the `JobPosting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobPosting" ADD COLUMN     "averageDailyRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "seniority" INTEGER NOT NULL;

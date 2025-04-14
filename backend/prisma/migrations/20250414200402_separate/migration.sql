/*
  Warnings:

  - Added the required column `address` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `location` on the `JobPosting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "JobPostingLocation" AS ENUM ('HYBRID', 'ONSITE', 'REMOTE');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JobPosting" DROP COLUMN "location",
ADD COLUMN     "location" "JobPostingLocation" NOT NULL;

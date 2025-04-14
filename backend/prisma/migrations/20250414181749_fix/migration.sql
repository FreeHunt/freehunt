/*
  Warnings:

  - You are about to drop the column `projectId` on the `JobPosting` table. All the data in the column will be lost.
  - You are about to drop the column `isPromoted` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jobPostingId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jobPostingId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JobPosting" DROP CONSTRAINT "JobPosting_projectId_fkey";

-- DropIndex
DROP INDEX "JobPosting_projectId_key";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "projectId" UUID;

-- AlterTable
ALTER TABLE "JobPosting" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "isPromoted",
DROP COLUMN "location",
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "freelanceId" UUID,
ADD COLUMN     "jobPostingId" UUID NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_projectId_key" ON "Invoice"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_jobPostingId_key" ON "Project"("jobPostingId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_freelanceId_fkey" FOREIGN KEY ("freelanceId") REFERENCES "Freelance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

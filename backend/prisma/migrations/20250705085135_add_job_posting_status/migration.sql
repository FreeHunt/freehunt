-- CreateEnum
CREATE TYPE "JobPostingStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'PUBLISHED', 'DRAFT', 'EXPIRED', 'REJECTED');

-- AlterTable
ALTER TABLE "JobPosting" ADD COLUMN     "status" "JobPostingStatus" NOT NULL DEFAULT 'PENDING_PAYMENT';

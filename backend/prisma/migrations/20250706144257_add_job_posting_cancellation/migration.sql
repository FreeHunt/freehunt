-- AlterEnum
ALTER TYPE "JobPostingStatus" ADD VALUE 'CANCELED';

-- AlterTable
ALTER TABLE "JobPosting" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "stripeRefundId" TEXT,
ADD COLUMN     "stripeSessionId" TEXT;

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CheckpointStatus" ADD VALUE 'PENDING_COMPANY_APPROVAL';
ALTER TYPE "CheckpointStatus" ADD VALUE 'DELAYED';
ALTER TYPE "CheckpointStatus" ADD VALUE 'CANCELED';

-- AlterTable
ALTER TABLE "Checkpoint" ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "submittedBy" UUID,
ADD COLUMN     "validatedAt" TIMESTAMP(3),
ADD COLUMN     "validatedBy" UUID;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'IN_PROGRESS';

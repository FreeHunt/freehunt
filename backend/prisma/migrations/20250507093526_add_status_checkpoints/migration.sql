-- CreateEnum
CREATE TYPE "CheckpointStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "Checkpoint" ADD COLUMN     "status" "CheckpointStatus" NOT NULL DEFAULT 'TODO';

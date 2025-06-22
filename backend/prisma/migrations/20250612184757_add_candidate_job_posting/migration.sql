-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Candidate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "jobPostingId" UUID NOT NULL,
    "freelanceId" UUID NOT NULL,
    "status" "CandidateStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_freelanceId_fkey" FOREIGN KEY ("freelanceId") REFERENCES "Freelance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

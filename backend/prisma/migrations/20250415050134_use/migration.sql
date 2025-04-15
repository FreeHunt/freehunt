/*
  Warnings:

  - You are about to drop the `Checkpoints` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Skills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FreelanceToSkills` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_JobPostingToSkills` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Checkpoints" DROP CONSTRAINT "Checkpoints_jobPostingId_fkey";

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_checkpointId_fkey";

-- DropForeignKey
ALTER TABLE "_FreelanceToSkills" DROP CONSTRAINT "_FreelanceToSkills_A_fkey";

-- DropForeignKey
ALTER TABLE "_FreelanceToSkills" DROP CONSTRAINT "_FreelanceToSkills_B_fkey";

-- DropForeignKey
ALTER TABLE "_JobPostingToSkills" DROP CONSTRAINT "_JobPostingToSkills_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobPostingToSkills" DROP CONSTRAINT "_JobPostingToSkills_B_fkey";

-- DropTable
DROP TABLE "Checkpoints";

-- DropTable
DROP TABLE "Logs";

-- DropTable
DROP TABLE "Skills";

-- DropTable
DROP TABLE "_FreelanceToSkills";

-- DropTable
DROP TABLE "_JobPostingToSkills";

-- CreateTable
CREATE TABLE "Skill" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "aliases" TEXT[],
    "type" "SkillType" NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checkpoint" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "jobPostingId" UUID NOT NULL,

    CONSTRAINT "Checkpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tableName" TEXT NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FreelanceToSkill" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_FreelanceToSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_JobPostingToSkill" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_JobPostingToSkill_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_normalizedName_key" ON "Skill"("normalizedName");

-- CreateIndex
CREATE INDEX "_FreelanceToSkill_B_index" ON "_FreelanceToSkill"("B");

-- CreateIndex
CREATE INDEX "_JobPostingToSkill_B_index" ON "_JobPostingToSkill"("B");

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_jobPostingId_fkey" FOREIGN KEY ("jobPostingId") REFERENCES "JobPosting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "Checkpoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FreelanceToSkill" ADD CONSTRAINT "_FreelanceToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "Freelance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FreelanceToSkill" ADD CONSTRAINT "_FreelanceToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobPostingToSkill" ADD CONSTRAINT "_JobPostingToSkill_A_fkey" FOREIGN KEY ("A") REFERENCES "JobPosting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobPostingToSkill" ADD CONSTRAINT "_JobPostingToSkill_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

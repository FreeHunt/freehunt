/*
  Warnings:

  - Changed the type of `type` on the `Skills` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Skills" DROP COLUMN "type",
ADD COLUMN     "type" "SkillType" NOT NULL;

-- DropEnum
DROP TYPE "TypeSkills";

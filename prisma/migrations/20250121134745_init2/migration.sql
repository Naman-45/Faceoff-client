-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "challengeType" "ChallengeType" NOT NULL DEFAULT 'PUBLIC';

/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `ChallengeStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `opponent_public_key` to the `challenges` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opponent_username` to the `challenges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChallengeStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED');
ALTER TABLE "challenges" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "challenges" ALTER COLUMN "status" TYPE "ChallengeStatus_new" USING ("status"::text::"ChallengeStatus_new");
ALTER TYPE "ChallengeStatus" RENAME TO "ChallengeStatus_old";
ALTER TYPE "ChallengeStatus_new" RENAME TO "ChallengeStatus";
DROP TYPE "ChallengeStatus_old";
ALTER TABLE "challenges" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "opponent_public_key" TEXT NOT NULL,
ADD COLUMN     "opponent_username" TEXT NOT NULL;

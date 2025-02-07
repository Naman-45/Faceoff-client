-- AlterTable
ALTER TABLE "challenges" ADD COLUMN     "creatorPhoneNumber" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "opponentPhoneNumber" BIGINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "challenges" ALTER COLUMN "creatorPhoneNumber" DROP DEFAULT,
ALTER COLUMN "creatorPhoneNumber" SET DATA TYPE TEXT,
ALTER COLUMN "opponentPhoneNumber" DROP DEFAULT,
ALTER COLUMN "opponentPhoneNumber" SET DATA TYPE TEXT;

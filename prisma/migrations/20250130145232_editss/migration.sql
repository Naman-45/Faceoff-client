/*
  Warnings:

  - You are about to alter the column `wager_amount` on the `challenges` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "challenges" ALTER COLUMN "wager_amount" SET DATA TYPE DOUBLE PRECISION;

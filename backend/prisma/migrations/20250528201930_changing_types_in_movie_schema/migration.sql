/*
  Warnings:

  - You are about to alter the column `budget` on the `movies` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `boxOffice` on the `movies` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "movies" ALTER COLUMN "budget" SET DATA TYPE INTEGER,
ALTER COLUMN "boxOffice" SET DATA TYPE INTEGER;

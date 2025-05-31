/*
  Warnings:

  - You are about to drop the column `durationMinutes` on the `movies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "movies" DROP COLUMN "durationMinutes",
ADD COLUMN     "duration" INTEGER;

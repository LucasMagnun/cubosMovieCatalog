/*
  Warnings:

  - Added the required column `originalTitle` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "originalTitle" TEXT NOT NULL;

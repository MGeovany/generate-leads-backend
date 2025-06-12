/*
  Warnings:

  - Added the required column `durationMs` to the `RequestLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RequestLog" ADD COLUMN     "durationMs" INTEGER NOT NULL;

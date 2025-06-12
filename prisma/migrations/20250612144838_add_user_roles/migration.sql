-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CREATOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CREATOR';

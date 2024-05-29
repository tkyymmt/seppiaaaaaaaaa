/*
  Warnings:

  - Added the required column `uid` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "uid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "uid" TEXT NOT NULL;

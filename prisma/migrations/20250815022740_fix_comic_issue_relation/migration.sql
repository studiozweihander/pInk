/*
  Warnings:

  - Added the required column `issues` to the `Comic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Comic" ADD COLUMN     "issues" INTEGER NOT NULL;

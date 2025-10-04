/*
  Warnings:

  - Made the column `comuna` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "comuna" SET NOT NULL;

/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Paseo` table. All the data in the column will be lost.
  - Added the required column `duenioId` to the `Paseo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paseadorId` to the `Paseo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoPaseo" AS ENUM ('PENDIENTE', 'ACEPTADO', 'EN_CURSO', 'FINALIZADO', 'CANCELADO');

-- DropForeignKey
ALTER TABLE "public"."Paseo" DROP CONSTRAINT "Paseo_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Paseo" DROP COLUMN "usuarioId",
ADD COLUMN     "duenioId" INTEGER NOT NULL,
ADD COLUMN     "estado" "EstadoPaseo" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "notas" TEXT,
ADD COLUMN     "paseadorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Tarjeta" (
    "idTarjeta" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "numero" TEXT NOT NULL,
    "nombreTitular" TEXT NOT NULL,
    "vencimiento" TEXT NOT NULL,
    "cvv" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "Tarjeta_pkey" PRIMARY KEY ("idTarjeta")
);

-- AddForeignKey
ALTER TABLE "Paseo" ADD CONSTRAINT "Paseo_duenioId_fkey" FOREIGN KEY ("duenioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paseo" ADD CONSTRAINT "Paseo_paseadorId_fkey" FOREIGN KEY ("paseadorId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarjeta" ADD CONSTRAINT "Tarjeta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

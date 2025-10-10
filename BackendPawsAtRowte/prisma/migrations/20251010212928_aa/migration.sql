-- DropForeignKey
ALTER TABLE "public"."Paseo" DROP CONSTRAINT "Paseo_paseadorId_fkey";

-- AlterTable
ALTER TABLE "Paseo" ALTER COLUMN "paseadorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Paseo" ADD CONSTRAINT "Paseo_paseadorId_fkey" FOREIGN KEY ("paseadorId") REFERENCES "Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

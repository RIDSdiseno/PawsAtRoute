-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('PASEADOR', 'DUEÑO');

-- CreateTable
CREATE TABLE "Usuario" (
    "idUsuario" SERIAL NOT NULL,
    "rut" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "fNacimiento" TIMESTAMP(3) NOT NULL,
    "correo" TEXT NOT NULL,
    "clave" TEXT NOT NULL,
    "carnetIdentidad" TEXT,
    "antecedentes" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'DUEÑO',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "Mascota" (
    "idMascota" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "raza" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,

    CONSTRAINT "Mascota_pkey" PRIMARY KEY ("idMascota")
);

-- CreateTable
CREATE TABLE "Paseo" (
    "idPaseo" SERIAL NOT NULL,
    "mascotaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" TIMESTAMP(3) NOT NULL,
    "duracion" INTEGER NOT NULL,
    "lugarEncuentro" TEXT NOT NULL,

    CONSTRAINT "Paseo_pkey" PRIMARY KEY ("idPaseo")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "rtHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "replacedByTokenId" INTEGER,
    "userAgent" TEXT,
    "ip" TEXT,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RefreshToken_rtHash_idx" ON "RefreshToken"("rtHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- AddForeignKey
ALTER TABLE "Mascota" ADD CONSTRAINT "Mascota_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paseo" ADD CONSTRAINT "Paseo_mascotaId_fkey" FOREIGN KEY ("mascotaId") REFERENCES "Mascota"("idMascota") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paseo" ADD CONSTRAINT "Paseo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

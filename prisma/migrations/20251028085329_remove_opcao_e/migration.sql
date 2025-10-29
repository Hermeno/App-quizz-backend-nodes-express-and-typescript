/*
  Warnings:

  - The `duracao` column on the `Exame` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `categoria` on the `Pergunta` table. All the data in the column will be lost.
  - You are about to drop the column `imagemA` on the `Pergunta` table. All the data in the column will be lost.
  - You are about to drop the column `imagemB` on the `Pergunta` table. All the data in the column will be lost.
  - You are about to drop the column `imagemC` on the `Pergunta` table. All the data in the column will be lost.
  - You are about to drop the column `imagemD` on the `Pergunta` table. All the data in the column will be lost.
  - You are about to drop the column `nivel` on the `Pergunta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exame" DROP COLUMN "duracao",
ADD COLUMN     "duracao" INTEGER;

-- AlterTable
ALTER TABLE "Pergunta" DROP COLUMN "categoria",
DROP COLUMN "imagemA",
DROP COLUMN "imagemB",
DROP COLUMN "imagemC",
DROP COLUMN "imagemD",
DROP COLUMN "nivel",
ADD COLUMN     "opcaoE" TEXT;

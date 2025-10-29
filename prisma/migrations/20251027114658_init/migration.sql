-- DropForeignKey
ALTER TABLE "public"."Pergunta" DROP CONSTRAINT "Pergunta_exameId_fkey";

-- AlterTable
ALTER TABLE "Exame" ADD COLUMN     "duracao" TEXT,
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'ativo',
ADD COLUMN     "numeroPerguntas" INTEGER NOT NULL DEFAULT 20;

-- AlterTable
ALTER TABLE "Pergunta" ADD COLUMN     "categoria" TEXT,
ADD COLUMN     "nivel" TEXT,
ALTER COLUMN "exameId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ExamePergunta" (
    "id" SERIAL NOT NULL,
    "exameId" INTEGER NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "ordem" INTEGER,

    CONSTRAINT "ExamePergunta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pergunta" ADD CONSTRAINT "Pergunta_exameId_fkey" FOREIGN KEY ("exameId") REFERENCES "Exame"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamePergunta" ADD CONSTRAINT "ExamePergunta_exameId_fkey" FOREIGN KEY ("exameId") REFERENCES "Exame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamePergunta" ADD CONSTRAINT "ExamePergunta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

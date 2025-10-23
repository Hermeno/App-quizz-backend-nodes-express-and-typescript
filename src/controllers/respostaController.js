import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registrarResposta = async (req, res) => {
  try {
    const { usuarioId, perguntaId, resposta } = req.body;

    const pergunta = await prisma.pergunta.findUnique({ where: { id: Number(perguntaId) } });
    if (!pergunta) return res.status(404).json({ error: "Pergunta não encontrada" });

    const correta = pergunta.correta === resposta;

    const resp = await prisma.resposta.create({ data: { usuarioId: Number(usuarioId), perguntaId: Number(perguntaId), resposta, correta } });
    res.status(201).json({ message: "Resposta registrada", resp });
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar resposta" });
  }
};

export const listarRespostas = async (req, res) => {
  try {
    const respostas = await prisma.resposta.findMany();
    res.json(respostas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar respostas" });
  }
};

export const listarRespostasPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const respostas = await prisma.resposta.findMany({ where: { usuarioId: Number(usuarioId) } });
    res.json(respostas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar respostas do usuário" });
  }
};

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const iniciarTentativa = async (req, res) => {
  try {
    const { usuarioId, exameId } = req.body;

    // Count previous tentativas
    const count = await prisma.tentativa.count({ where: { usuarioId: Number(usuarioId), exameId: Number(exameId) } });
    const numero = count + 1;
    if (numero > 2) return res.status(400).json({ error: "Limite de tentativas atingido" });

    const tentativa = await prisma.tentativa.create({ data: { usuarioId: Number(usuarioId), exameId: Number(exameId), numero, concluido: false } });
    res.status(201).json({ message: "Tentativa iniciada", tentativa });
  } catch (error) {
    res.status(500).json({ error: "Erro ao iniciar tentativa" });
  }
};

export const concluirTentativa = async (req, res) => {
  try {
    const { id } = req.params;
    const { nota } = req.body;
    const tentativa = await prisma.tentativa.update({ where: { id: Number(id) }, data: { nota: Number(nota), concluido: true } });
    res.json({ message: "Tentativa concluída", tentativa });
  } catch (error) {
    res.status(500).json({ error: "Erro ao concluir tentativa" });
  }
};

export const listarTentativasPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const tentativas = await prisma.tentativa.findMany({ where: { usuarioId: Number(usuarioId) } });
    res.json(tentativas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar tentativas do usuário" });
  }
};

export const listarTentativasPorExame = async (req, res) => {
  try {
    const { exameId } = req.params;
    const tentativas = await prisma.tentativa.findMany({ where: { exameId: Number(exameId) } });
    res.json(tentativas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar tentativas do exame" });
  }
};

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



export const iniciarTentativa = async (req, res) => {
  try {
    const { exameId } = req.body;
    const usuarioId = req.user.id; // vindo do verifyToken
    const tentativas = await prisma.tentativa.findMany({
      where: { usuarioId: Number(usuarioId), exameId: Number(exameId) },
      orderBy: { numero: 'asc' },
    });
    if (tentativas.length >= 20) {
      return res.status(400).json({ error: "Limite de tentativas (2) atingido para este exame!" });
    }
    const numero = tentativas.length === 0 ? 1 : 2;
    const tentativa = await prisma.tentativa.create({
      data: { usuarioId: Number(usuarioId), exameId: Number(exameId), numero },
    });

    console.log("Tentativa criada:", tentativa);
    res.status(201).json({ 
      message: "Tentativa registrada",
      tentativaId: tentativa.id,
      numero: tentativa.numero 
    });

  } catch (error) {
    console.error("Erro ao registrar tentativa:", error);
    res.status(500).json({ error: "Erro ao registrar tentativa" });
  }
};



export const buscarTentativaPorExame = async (req, res) => {
  try {
    const { exameId } = req.params;
    const usuarioId = req.user.id; // vindo do verifyToken

    console.log("Buscando tentativa para usuário:", usuarioId, "e exame:", exameId);

    const tentativa = await prisma.tentativa.findFirst({
      where: { usuarioId: Number(usuarioId), exameId: Number(exameId) },
      orderBy: { numero: 'asc' },
    });

    if (!tentativa) {
      console.log("Nenhuma tentativa encontrada para o usuário:", usuarioId, "e exame:", exameId);
      return res.status(404).json({ error: "Nenhuma tentativa encontrada para este exame" });
    }

    console.log("Tentativa encontrada:", tentativa);
    res.json(tentativa);
  } catch (error) {
    console.error("Erro ao buscar tentativa:", error);
    res.status(500).json({ error: "Erro ao buscar tentativa" });
  }
};  

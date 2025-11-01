import { PrismaClient } from "@prisma/client";
import e from "express";

const prisma = new PrismaClient();

export const registrarResposta = async (req, res) => {
  try {
    const { usuarioId, perguntaId, resposta } = req.body;

    const pergunta = await prisma.pergunta.findUnique({ where: { id: Number(perguntaId) } });
    if (!pergunta) return res.status(404).json({ error: "Pergunta não encontrada" });

    const respostaLimpa = resposta.replace('opcao', '').toUpperCase();
    const respostaCorretaLimpa = pergunta.correta.toUpperCase();
    const correta = respostaLimpa === respostaCorretaLimpa;
    
    console.log("Verificando resposta:", {
      perguntaId,
      respostaUsuario: resposta,
      respostaLimpa,
      respostaCorreta: pergunta.correta,
      respostaCorretaLimpa,
      correta
    });

    const resp = await prisma.resposta.create({ data: { usuarioId: Number(usuarioId), perguntaId: Number(perguntaId), resposta, correta } });
    console.log("Resposta registrada:", resp);
    res.status(201).json({ message: "Resposta registrada", resp });
  } catch (error) {
    console.error("Erro ao registrar resposta:", error);
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



export const calcularMediaPorExame = async (req, res) => {
  try {
    const {usuarioId, exameId } = req.params;
    console.log("Calculando média para usuário:", usuarioId, "exame:", exameId);

    const perguntasDoExame = await prisma.pergunta.findMany({ 
      where: { exameId: Number(exameId) } 
    });
    console.log("Perguntas encontradas:", perguntasDoExame.length);
    
    const perguntaIds = perguntasDoExame.map((p) => p.id);
    console.log("IDs das perguntas:", perguntaIds);

    const respostasCorretas = await prisma.resposta.count({
      where: {
        usuarioId: Number(usuarioId),
        perguntaId: { in: perguntaIds },
        correta: true,
      },
    });
    console.log("Respostas corretas:", respostasCorretas);

    const totalPerguntas = perguntaIds.length;
    const media = totalPerguntas > 0 ? (respostasCorretas / totalPerguntas) * 100 : 0;

    const resultado = {
      totalPerguntas,
      respostasCorretas,
      media: Number(media.toFixed(2)),
      perguntasEncontradas: perguntasDoExame.length > 0
    };
    console.log("Resultado do cálculo:", resultado);

    res.json(resultado);
  } catch (error) {
    console.error("Erro ao calcular média:", error);
    res.status(500).json({ error: "Erro ao calcular média" });
  }
};


// listar todas do exame as corectas e erradas por aluno depois de ter terminado exame
export const listarRespostasPorExameEUsuario = async (req, res) => {
  try {
    const { usuarioId, exameId } = req.params;

    const perguntasDoExame = await prisma.pergunta.findMany({
      where: { exameId: Number(exameId) }
    });
    const perguntaIds = perguntasDoExame.map((p) => p.id);

    const respostas = await prisma.resposta.findMany({
      where: {
        usuarioId: Number(usuarioId),
        perguntaId: { in: perguntaIds }
      }
    });

    res.json(respostas);
  } catch (error) {
    console.error("Erro ao listar respostas por exame e usuário:", error);
    res.status(500).json({ error: "Erro ao listar respostas por exame e usuário" });
  }
};



//   Numero total (numero) "exemplo 5 total" de respostas correctas  por exame e usuario 
export const contarRespostasCorretasPorExameEUsuario = async (req, res) => {
  try {
    const { usuarioId, exameId } = req.params;

    const perguntasDoExame = await prisma.pergunta.findMany({
      where: { exameId: Number(exameId) }
    });
    const perguntaIds = perguntasDoExame.map((p) => p.id);

    const totalCorretas = await prisma.resposta.count({
      where: {
        usuarioId: Number(usuarioId),
        perguntaId: { in: perguntaIds },
        correta: true
      }
    });

    res.json({ totalCorretas });
  } catch (error) {
    console.error("Erro ao contar respostas corretas por exame e usuário:", error);
    res.status(500).json({ error: "Erro ao contar respostas corretas por exame e usuário" });
  }
};


// agora erradas
export const contarRespostasErradasPorExameEUsuario = async (req, res) => {
  try {
    const { usuarioId, exameId } = req.params;

    const perguntasDoExame = await prisma.pergunta.findMany({
      where: { exameId: Number(exameId) }
    });
    const perguntaIds = perguntasDoExame.map((p) => p.id);

    const totalErradas = await prisma.resposta.count({
      where: {
        usuarioId: Number(usuarioId),
        perguntaId: { in: perguntaIds },
        correta: false
      }
    });

    res.json({ totalErradas });
  } catch (error) {
    console.error("Erro ao contar respostas erradas por exame e usuário:", error);
    res.status(500).json({ error: "Erro ao contar respostas erradas por exame e usuário" });
  }
};  

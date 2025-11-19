import { PrismaClient } from "@prisma/client";
import e from "express";

const prisma = new PrismaClient();

export const registrarResposta = async (req, res) => {
  try {
    const { perguntaId, resposta, tentativaId } = req.body;
    const usuarioId = req.user.id;

    if (!perguntaId) {
      return res.status(400).json({ error: "ID da pergunta é obrigatório" });
    }
    if (!resposta) {
      return res.status(400).json({ error: "Resposta é obrigatória" });
    }

    const pergunta = await prisma.pergunta.findUnique({ where: { id: Number(perguntaId) } });
    if (!pergunta) {
      console.error('Pergunta não encontrada:', perguntaId);
      return res.status(404).json({ error: "Pergunta não encontrada" });
    }

    // Remove o prefixo "opcao" e deixa apenas A, B, C, D...
    const respostaLetra = resposta.replace(/^opcao/i, "").toUpperCase();
    const respostaCorretaLetra = pergunta.correta.replace(/^opcao/i, "").toUpperCase();
    const correta = respostaLetra === respostaCorretaLetra;

    const resp = await prisma.resposta.create({
      data: {
        usuarioId: Number(usuarioId),
        perguntaId: Number(perguntaId),
        tentativaId: Number(tentativaId),
        resposta: respostaLetra, // <- salva apenas "A", "B", "C"...
        correta
      }
    });

    console.log("Resposta registrada:", {
      id: resp.id,
      usuarioId: resp.usuarioId,
      perguntaId: resp.perguntaId,
      tentativaId: resp.tentativaId,
      resposta: resp.resposta,
      correta: resp.correta
    });

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
    const usuarioId = req.user.id;
    const respostas = await prisma.resposta.findMany({ where: { usuarioId: Number(usuarioId) } });
    res.json(respostas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar respostas do usuário" });
  }
};








export const calcularMediaPorExame = async (req, res) => {
  try {
    const { exameId, tentativaId } = req.params;
    const usuarioId = req.user.id;

    console.log("Calculando média:", { exameId, tentativaId, usuarioId });

    if (!exameId || !tentativaId) {
      console.error("Parâmetros inválidos:", { exameId, tentativaId });
      return res.status(400).json({ error: "ID do exame e ID da tentativa são obrigatórios" });
    }

    const perguntasDoExame = await prisma.pergunta.findMany({ 
      where: { exameId: Number(exameId) } 
    });    

    if (perguntasDoExame.length === 0) {
      console.log("Nenhuma pergunta encontrada para o exame:", exameId);
      return res.status(404).json({ error: "Nenhuma pergunta encontrada para este exame" });
    }

    const perguntaIds = perguntasDoExame.map((p) => p.id);
    console.log("IDs das perguntas:", perguntaIds);

    const respostasCorretas = await prisma.resposta.count({
      where: {
        usuarioId: Number(usuarioId),
        perguntaId: { in: perguntaIds },
        tentativaId: Number(tentativaId),
        correta: true,
      },
    });

    console.log("Respostas corretas (count):", respostasCorretas);

    // Também buscar e logar as respostas filtradas para inspeção detalhada
    try {
      const respostasFiltradas = await prisma.resposta.findMany({
        where: {
          usuarioId: Number(usuarioId),
          perguntaId: { in: perguntaIds },
          tentativaId: Number(tentativaId),
        },
      });
      console.log("Respostas filtradas para cálculo de média:", respostasFiltradas);
    } catch (innerErr) {
      console.error("Erro ao buscar respostas filtradas para debug:", innerErr);
    }
    const totalPerguntas = perguntaIds.length;
    const media = totalPerguntas > 0 ? (respostasCorretas / totalPerguntas) * 100 : 0;
    const resultado = {
      totalPerguntas,
      respostasCorretas,
      media: Number(media.toFixed(2)),
      perguntasEncontradas: perguntasDoExame.length > 0
    };
    res.json(resultado);
  } catch (error) {
    console.error("Erro ao calcular média:", error);
    res.status(500).json({ error: "Erro ao calcular média" });
  }
};









export const listarRespostasPorExameEUsuario = async (req, res) => {
  try {
    const { exameId, tentativaId } = req.params;
    const usuarioId = req.user.id;

    const perguntasDoExame = await prisma.pergunta.findMany({
      where: { exameId: Number(exameId) }
    });

    const perguntaIds = perguntasDoExame.map((p) => p.id);

    console.log("Listando respostas por exame e usuário ->", { 
      exameId, 
      tentativaId, 
      usuarioId, 
      perguntaIds 
    });

    // 🔥 AQUI ESTÁ A MUDANÇA IMPORTANTE
    const respostas = await prisma.resposta.findMany({
      where: {
        usuarioId: Number(usuarioId),
        perguntaId: { in: perguntaIds },
        tentativaId: Number(tentativaId)
      },
      include: {
        pergunta: true, // 🔥 RETORNA O EXERCÍCIO COMPLETO
      }
    });

    console.log("Respostas retornadas (AGORA COM PERGUNTA):", respostas);

    res.json(respostas);

  } catch (error) {
    console.error("Erro ao listar respostas por exame e usuário:", error);
    res.status(500).json({ error: "Erro ao listar respostas por exame e usuário" });
  }
};












export const contarRespostasCorretasPorExameEUsuario = async (req, res) => {
  try {
    const { exameId, tentativaId } = req.params;
     const usuarioId = req.user.id 

    const perguntasDoExame = await prisma.pergunta.findMany({
      where: { exameId: Number(exameId) }
    });
    const perguntaIds = perguntasDoExame.map((p) => p.id);

    console.log('Contando corretas ->', { exameId, tentativaId, usuarioId, perguntaIds });
    const respostasFiltradas = await prisma.resposta.findMany({
      where: {
        usuarioId: Number(usuarioId),
        perguntaId: { in: perguntaIds },
        tentativaId: Number(tentativaId),
      }
    });
    console.log('Respostas filtradas (para contar corretas):', respostasFiltradas);
    const totalCorretas = respostasFiltradas.filter(r => r.correta === true).length;
    console.log('Total corretas (calculado):', totalCorretas);
    res.json({ totalCorretas });
  } catch (error) {
    console.error("Erro ao contar respostas corretas por exame e usuário:", error);
    res.status(500).json({ error: "Erro ao contar respostas corretas por exame e usuário" });
  }
};









export const contarRespostasErradasPorExameEUsuario = async (req, res) => {
  try {
    const {exameId , tentativaId} = req.params;
     const usuarioId = req.user.id 

    const perguntasDoExame = await prisma.pergunta.findMany({
      where: { exameId: Number(exameId) }
    });
    const perguntaIds = perguntasDoExame.map((p) => p.id);

    console.log('Contando erradas ->', { exameId, tentativaId, usuarioId, perguntaIds });
    const respostasFiltradas = await prisma.resposta.findMany({
      where: {
        usuarioId: Number(usuarioId),
        perguntaId: { in: perguntaIds },
        tentativaId: Number(tentativaId),
      }
    });
    console.log('Respostas filtradas (para contar erradas):', respostasFiltradas);
    const totalErradas = respostasFiltradas.filter(r => r.correta === false).length;
    console.log('Total erradas (calculado):', totalErradas);
    res.json({ totalErradas });
  } catch (error) {
    console.error("Erro ao contar respostas erradas por exame e usuário:", error);
    res.status(500).json({ error: "Erro ao contar respostas erradas por exame e usuário" });
  }
};  

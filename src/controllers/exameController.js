import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// Json example for postman
{
  /*
    "titulo": "Exame de Matemática",
    "descricao": "Prova abrangendo álgebra e geometria",
    "data": "2024-07-15T10:00:00Z",
    "duracao": 90,
    "preco": 20.0,
    "numeroPerguntas": 30,
    "criadorId": 1
  */
}

export const criarExame = async (req, res) => {

  try {
    const { titulo, descricao, preco, numeroPerguntas, criadorId  } = req.body;
    // turn int duracao and turn float preco, and turn int numeroPerguntas
    const duracao = parseInt(req.body.duracao, 10);
    const precoFloat = parseFloat(preco);
    const numeroPerguntasInt = parseInt(numeroPerguntas, 10);
    const userid = req.user.id; 
    const exame = await prisma.exame.create({
      data: { titulo, descricao, duracao, preco: precoFloat || 0, numeroPerguntas: numeroPerguntasInt || 20, estado: "ativo", criadorId: criadorId || userid
      },
    });
    res.status(201).json({ message: "Exame criado", exame });
  } catch (error) {
    console.error("Erro ao criar exame:", error);
    res.status(500).json({ error: "Erro ao criar exame" });
  }
};






export const listarExames = async (req, res) => {
  try {
    const exames = await prisma.exame.findMany();
    res.json(exames);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar exames" });
  }
};

export const obterExame = async (req, res) => {
  try {
    const { id } = req.params;
    const exame = await prisma.exame.findUnique({ where: { id: Number(id) } });
    if (!exame) return res.status(404).json({ error: "Exame não encontrado" });
    res.json(exame);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter exame" });
  }
};

export const atualizarExame = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;
    const exame = await prisma.exame.update({ where: { id: Number(id) }, data: dados });
    res.json({ message: "Exame atualizado", exame });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar exame" });
  }
};

export const excluirExame = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.exame.delete({ where: { id: Number(id) } });
    res.json({ message: "Exame excluído" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir exame" });
  }
};

export const listarExamesPorCriador = async (req, res) => {
  try {
    const { criadorId } = req.params;
    const exames = await prisma.exame.findMany({ where: { criadorId: Number(criadorId) } });
    res.json(exames);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar exames do criador" });
  }
};

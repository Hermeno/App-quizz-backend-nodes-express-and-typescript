import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const criarTexto = async (req, res) => {
  try {
    const { exameId, titulo, texto } = req.body;
    const usuarioId = req.user.id;

    if (!exameId || !texto) {
      return res.status(400).json({ error: "exameId e texto são obrigatórios" });
    }

    const novoTexto = await prisma.texto.create({
      data: {
        exameId: Number(exameId),
        usuarioId: Number(usuarioId),
        titulo: titulo || null,
        texto,
      },
    });

    res.status(201).json({ message: "Texto criado", texto: novoTexto });
  } catch (error) {
    console.error("Erro ao criar texto:", error);
    res.status(500).json({ error: "Erro ao criar texto" });
  }
};

export const listarTextos = async (req, res) => {
  try {
    const textos = await prisma.texto.findMany();
    res.json(textos);
  } catch (error) {
    console.error("Erro ao listar textos:", error);
    res.status(500).json({ error: "Erro ao listar textos" });
  }
};

export const listarTextosPorExame = async (req, res) => {
  try {
    const { exameId } = req.params;

    if (!exameId) {
      return res.status(400).json({ error: "exameId é obrigatório" });
    }

    const textos = await prisma.texto.findMany({
      where: { exameId: Number(exameId) },
      orderBy: { createdAt: 'asc' }, // ordena por data de criação
    });

    res.json(textos);
  } catch (error) {
    console.error("Erro ao listar textos por exame:", error);
    res.status(500).json({ error: "Erro ao listar textos por exame" });
  }
};

export const obterTexto = async (req, res) => {
  try {
    const { id } = req.params;

    const texto = await prisma.texto.findUnique({
      where: { id: Number(id) },
    });

    if (!texto) {
      return res.status(404).json({ error: "Texto não encontrado" });
    }

    res.json(texto);
  } catch (error) {
    console.error("Erro ao obter texto:", error);
    res.status(500).json({ error: "Erro ao obter texto" });
  }
};

export const atualizarTexto = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, texto } = req.body;

    const textoAtualizado = await prisma.texto.update({
      where: { id: Number(id) },
      data: { titulo, texto },
    });

    res.json({ message: "Texto atualizado", texto: textoAtualizado });
  } catch (error) {
    console.error("Erro ao atualizar texto:", error);
    res.status(500).json({ error: "Erro ao atualizar texto" });
  }
};

export const deletarTexto = async (req, res) => {
  try {
    const { id } = req.params;

    const textoDeleteado = await prisma.texto.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Texto deletado", texto: textoDeleteado });
  } catch (error) {
    console.error("Erro ao deletar texto:", error);
    res.status(500).json({ error: "Erro ao deletar texto" });
  }
};

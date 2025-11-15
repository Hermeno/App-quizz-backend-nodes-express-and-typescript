import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const criarTexto = async (req, res) => {
  try {
    // logs de debug para entender requests que chegam
    console.log('POST /textos - headers:', {
      authorization: req.headers.authorization ? 'present' : 'missing',
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length']
    });
    console.log('POST /textos - body (raw):', req.body);
    // verifica autenticação (middleware deve popular req.user)
    const usuarioId = req?.user?.id;
    
    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const { exameId, titulo, texto } = req.body || {};

    // validação clara de campos obrigatórios
    if (!exameId) {
      return res.status(400).json({ error: 'exameId é obrigatório' });
    }
    if (!texto || String(texto).trim() === '') {
      return res.status(400).json({ error: 'texto é obrigatório' });
    }

    // verifique se o exame existe
    const exame = await prisma.exame.findUnique({ where: { id: Number(exameId) } });
    if (!exame) {
      
      return res.status(400).json({ error: 'exameId inválido' });
    }

    const novoTexto = await prisma.texto.create({
      data: {
        exameId: Number(exameId),
        usuarioId: Number(usuarioId),
        titulo: titulo || null,
        texto,
      },
    });

    res.status(201).json({ message: 'Texto criado', texto: novoTexto });
  } catch (error) {
    console.error('Erro ao criar texto:', error && error.stack ? error.stack : error);
    // incluir mensagem de erro no response para facilitar debug (não incluir stack em produção)
    res.status(500).json({ error: 'Erro ao criar texto', detail: String(error?.message || error) });
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
    console.log('GET /textos/exame/:exameId - params:', req.params, 'headers:', { authorization: req.headers.authorization ? 'present' : 'missing' });

    if (!exameId) {
      return res.status(400).json({ error: "exameId é obrigatório" });
    }

    const textos = await prisma.texto.findMany({
      where: { exameId: Number(exameId) },
      // O modelo `Texto` não possui campo `createdAt` no schema atual.
      // Ordena por `id` como fallback para garantir ordem determinística.
      orderBy: { id: 'asc' },
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

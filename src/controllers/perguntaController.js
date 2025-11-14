import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

export const upload = multer({ storage });

// Criar pergunta (com ou sem imagem)
export const criarPergunta = async (req, res) => {
  try {
    const { pergunta, tipo, opcaoA, opcaoB, opcaoC, opcaoD, correta, exameId } = req.body;
    let imagemPergunta = null;

    if (req.file) {
      imagemPergunta = `/uploads/${req.file.filename}`;
    }

    const perguntaCriada = await prisma.pergunta.create({
      data: { pergunta, imagemPergunta, tipo, opcaoA, opcaoB, opcaoC, opcaoD, correta, exameId: Number(exameId) }
    });

    res.status(201).json({ message: "Pergunta criada", pergunta: perguntaCriada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar pergunta" });
  }
};

// Listar todas as perguntas com link completo da imagem
export const listarPerguntas = async (req, res) => {
  try {
    const perguntas = await prisma.pergunta.findMany();
    
    const perguntasComLink = perguntas.map(p => ({
      ...p,
      imagemPergunta: p.imagemPergunta ? `${req.protocol}://${req.get('host')}${p.imagemPergunta}` : null
    }));

    res.json(perguntasComLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar perguntas" });
  }
};

// Obter pergunta por ID
export const obterPergunta = async (req, res) => {
  try {
    const { id } = req.params;
    const pergunta = await prisma.pergunta.findUnique({ where: { id: Number(id) } });
    if (!pergunta) return res.status(404).json({ error: "Pergunta não encontrada" });

    const perguntaComLink = {
      ...pergunta,
      imagemPergunta: pergunta.imagemPergunta ? `${req.protocol}://${req.get('host')}${pergunta.imagemPergunta}` : null
    };

    res.json(perguntaComLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao obter pergunta" });
  }
};

// Atualizar pergunta (com ou sem nova imagem)
export const atualizarPergunta = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    if (req.file) {
      dados.imagemPergunta = `/uploads/${req.file.filename}`;
    }

    const perguntaAtualizada = await prisma.pergunta.update({
      where: { id: Number(id) },
      data: dados
    });

    res.json({ message: "Pergunta atualizada", pergunta: perguntaAtualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar pergunta" });
  }
};

// Excluir pergunta
export const excluirPergunta = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pergunta.delete({ where: { id: Number(id) } });
    res.json({ message: "Pergunta excluída" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao excluir pergunta" });
  }
};

// Listar perguntas por exame com link completo da imagem
export const listarPerguntasPorExame = async (req, res) => {
  try {
    const { exameId } = req.params;

    if (!exameId) return res.status(400).json({ error: "ID do exame é obrigatório" });

    const perguntas = await prisma.pergunta.findMany({
      where: { exameId: Number(exameId) },
      orderBy: { id: 'asc' }
    });

    const perguntasComLink = perguntas.map(p => ({
      ...p,
      imagemPergunta: p.imagemPergunta ? `${req.protocol}://${req.get('host')}${p.imagemPergunta}` : null
    }));

    res.json(perguntasComLink);
  } catch (error) {
    console.error('Erro ao listar perguntas do exame:', error);
    res.status(500).json({ error: `Erro ao listar perguntas do exame: ${error.message}` });
  }
};

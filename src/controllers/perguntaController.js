import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";
import archiver from "archiver";

const prisma = new PrismaClient();

// Configuração do multer
// Permitir sobrescrever o diretório de uploads via variável de ambiente
// para suportar discos persistentes em provedores como Render ou paths customizados.
const uploadsRoot = process.env.UPLOADS_DIR ? path.resolve(process.env.UPLOADS_DIR) : path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsRoot)) fs.mkdirSync(uploadsRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsRoot);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-\_]/g, '-');
    cb(null, `${file.fieldname}-${uniqueSuffix}-${safeName}`);
  }
});

function fileFilter(req, file, cb){
  // aceitar apenas imagens
  if(!file.mimetype.startsWith('image/')) return cb(new Error('Apenas imagens são permitidas'), false);
  cb(null, true);
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// Criar pergunta
export const criarPergunta = async (req, res) => {
  try {
    console.log('POST /perguntas - headers:', { authorization: req.headers.authorization ? 'present' : 'missing', 'content-type': req.headers['content-type'] });
    console.log('POST /perguntas - body keys:', Object.keys(req.body || {}));
    if (req.file) console.log('POST /perguntas - file:', { fieldname: req.file.fieldname, filename: req.file.filename, size: req.file.size });
    const { pergunta, tipo, opcaoA, opcaoB, opcaoC, opcaoD, opcaoE, opcaoF, correta, exameId, tentativaId } = req.body;

    const imagem = req.file ? `/uploads/${req.file.filename}` : null;

    const perguntaCriada = await prisma.pergunta.create({
      data: {
        pergunta: pergunta || null,
        tipo: tipo || 'texto',
        opcaoA: opcaoA || null,
        opcaoB: opcaoB || null,
        opcaoC: opcaoC || null,
        opcaoD: opcaoD || null,
        opcaoE: opcaoE || null,
        opcaoF: opcaoF || null,
        correta: correta || null,
        exameId: exameId ? Number(exameId) : null,
        tentativaId: tentativaId ? Number(tentativaId) : null,
        imagem
      }
    });

    res.status(201).json({ message: "Pergunta criada", pergunta: perguntaCriada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar pergunta" });
  }
};

// Listar perguntas
export const listarPerguntas = async (req, res) => {
  try {
    const perguntas = await prisma.pergunta.findMany();
    const perguntasComLink = perguntas.map(p => ({
      ...p,
      // manter propriedade `imagem` e também fornecer `imagemPergunta` para compatibilidade com frontend
      imagem: p.imagem ? `${req.protocol}://${req.get('host')}${p.imagem}` : null,
      imagemPergunta: p.imagem ? `${req.protocol}://${req.get('host')}${p.imagem}` : null
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

    res.json({
      ...pergunta,
      imagem: pergunta.imagem ? `${req.protocol}://${req.get('host')}${pergunta.imagem}` : null,
      imagemPergunta: pergunta.imagem ? `${req.protocol}://${req.get('host')}${pergunta.imagem}` : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao obter pergunta" });
  }
};

// Atualizar pergunta
export const atualizarPergunta = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = { ...req.body };

    if (req.file) dados.imagem = `/uploads/${req.file.filename}`;

    const perguntaAtualizada = await prisma.pergunta.update({
      where: { id: Number(id) },
      data: {
        pergunta: dados.pergunta || null,
        tipo: dados.tipo || 'texto',
        opcaoA: dados.opcaoA || null,
        opcaoB: dados.opcaoB || null,
        opcaoC: dados.opcaoC || null,
        opcaoD: dados.opcaoD || null,
        opcaoE: dados.opcaoE || null,
        opcaoF: dados.opcaoF || null,
        correta: dados.correta || null,
        exameId: dados.exameId ? Number(dados.exameId) : null,
        tentativaId: dados.tentativaId ? Number(dados.tentativaId) : null,
        imagem: dados.imagem || null
      }
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

// Listar perguntas por exame
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
      imagem: p.imagem ? `${req.protocol}://${req.get('host')}${p.imagem}` : null,
      imagemPergunta: p.imagem ? `${req.protocol}://${req.get('host')}${p.imagem}` : null
    }));

    res.json(perguntasComLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar perguntas do exame" });
  }
};




// Baixar todas as imagens das perguntas como um arquivo ZIP
export const baixarImagens = async (req, res) => {
  try {
    const uploadsDir = process.env.UPLOADS_DIR
      ? path.resolve(process.env.UPLOADS_DIR)
      : path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadsDir)) {
      return res.status(404).json({ error: "Diretório de uploads não encontrado" });
    }

    const files = fs.readdirSync(uploadsDir);
    if (files.length === 0) {
      return res.status(400).json({ error: "Nenhuma imagem encontrada" });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=imagens.zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    // Adiciona todas as imagens com nome REAL
    files.forEach((file) => {
      const filePath = path.join(uploadsDir, file);
      archive.file(filePath, { name: file });
    });

    archive.finalize();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar ZIP" });
  }
};
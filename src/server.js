import express from "express";
import path from 'path';
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/authRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import exameRoutes from "./routes/exameRoutes.js";
import perguntaRoutes from "./routes/perguntaRoutes.js";
import respostaRoutes from "./routes/respostaRoutes.js";
import pagamentoRoutes from "./routes/pagamentoRoutes.js";
import tentativaRoutes from "./routes/tentativaRoutes.js";
import textoRoutes from "./routes/textoRoutes.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// ✅ CONFIGURA O CORS ANTES DAS ROTAS
app.use(cors({
  origin: [
    "https://dashboard-aprovaqui.onrender.com",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://localhost"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


// Parser JSON com limite razoável e lógica para pular parsing quando o
// cliente informou Content-Length: 0 (evita `Unexpected end of JSON input`).
// Observação: se Transfer-Encoding for 'chunked' ou Content-Length ausente,
// assumimos que pode haver corpo e permitimos o parse normalmente.
app.use(express.json({
  limit: '10mb',
  type: (req) => {
    const ct = (req.headers['content-type'] || '').toLowerCase();
    if (!ct.includes('application/json')) return false;
    const len = req.headers['content-length'];
    const te = (req.headers['transfer-encoding'] || '').toLowerCase();
    // Se o cliente declarou explicitamente Content-Length: 0, não parsear
    if (typeof len !== 'undefined' && Number(len) === 0) return false;
    // Caso transfer-encoding seja chunked, permita parse (pode ter corpo)
    if (te && te.includes('chunked')) return true;
    // Se Content-Length estiver ausente, permitimos o parse (compatível com fetch/axios)
    return true;
  }
}));
// Serve arquivos de upload a partir do diretório configurado (UPLOADS_DIR)
const uploadsStaticDir = process.env.UPLOADS_DIR ? path.resolve(process.env.UPLOADS_DIR) : 'uploads';
app.use('/uploads', express.static(uploadsStaticDir));

// Rotas
app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/exames", exameRoutes);
app.use("/perguntas", perguntaRoutes);
app.use("/respostas", respostaRoutes);
app.use("/pagamentos", pagamentoRoutes);
app.use("/tentativas", tentativaRoutes);
app.use("/textos", textoRoutes);

app.get("/", (req, res) => res.send("API do AprovAqui Online 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Error handler para capturar JSON inválido e evitar crash do processo
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    console.error('JSON parse error:', err.message);
    return res.status(400).json({ error: 'JSON inválido ou body vazio' });
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('SyntaxError ao parsear JSON:', err.message);
    return res.status(400).json({ error: 'JSON inválido' });
  }
  next(err);
});

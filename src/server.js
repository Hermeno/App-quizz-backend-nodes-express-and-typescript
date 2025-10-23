import express from "express";
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

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Rotas
app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/exames", exameRoutes);
app.use("/perguntas", perguntaRoutes);
app.use("/respostas", respostaRoutes);
app.use("/pagamentos", pagamentoRoutes);
app.use("/tentativas", tentativaRoutes);

app.get("/", (req, res) => res.send("API do AprovAqui Online 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

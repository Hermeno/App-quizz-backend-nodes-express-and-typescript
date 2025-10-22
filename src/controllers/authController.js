import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const registrar = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body; // tipo: 'aluno' ou 'professor'

    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) return res.status(400).json({ error: "Email já cadastrado" });

    const hashed = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senha: hashed, tipo },
    });

    res.status(201).json({ message: "Usuário cadastrado com sucesso", usuario: novoUsuario });
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(400).json({ error: "Usuário não encontrado" });

    const valido = await bcrypt.compare(senha, usuario.senha);
    if (!valido) return res.status(401).json({ error: "Senha incorreta" });

    const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login bem-sucedido", token });
  } catch (error) {
    res.status(500).json({ error: "Erro no login" });
  }
};

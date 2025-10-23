import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({ select: { senha: false } });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
};

export const obterUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({ where: { id: Number(id) }, select: { senha: false } });
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter usuário" });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;
    // Prevent changing password here; use a dedicated route if needed
    delete dados.senha;

    const usuario = await prisma.usuario.update({ where: { id: Number(id) }, data: dados });
    res.json({ message: "Usuário atualizado", usuario });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

export const excluirUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.usuario.delete({ where: { id: Number(id) } });
    res.json({ message: "Usuário excluído" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
};

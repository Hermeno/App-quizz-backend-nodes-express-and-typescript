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
    if (!req.user) {
      console.error('User object is missing in request');
      return res.status(401).json({ error: "Usuário não autenticado" });
    }
    
    const id = req.user.id;
    if (!id) {
      console.error('User ID is missing in request');
      return res.status(400).json({ error: "ID do usuário não fornecido" });
    }

    console.log('Buscando usuário com ID:', id);
    const usuario = await prisma.usuario.findUnique({ 
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        criadoEm: true,
        // senha is explicitly omitted for security
      }
    });
    
    if (!usuario) {
      console.log('Usuário não encontrado para o ID:', id);
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ error: `Erro ao obter usuário: ${error.message}` });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    if (!req.user?.id) {
      console.error('ID do usuário não encontrado no token');
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { nome, email, numero, cidade, classe } = req.body;
    
    if (!nome || !email) {
      console.error('Dados obrigatórios não fornecidos:', { nome, email });
      return res.status(400).json({ error: "Nome e email são obrigatórios" });
    }

    // Limpar o formato do número de telefone, removendo códigos de país
    let numeroLimpo = numero;
    if (numero) {
      // Remove prefixos de país comuns (+258-, +55-, etc)
      numeroLimpo = numero.replace(/^\+\d{2,3}-/, '');
      // Remove outros caracteres não numéricos que possam existir
      numeroLimpo = numeroLimpo.replace(/[^\d]/g, '');
      
      console.log('Número original:', numero);
      console.log('Número processado:', numeroLimpo);
    }

    console.log('Atualizando usuário:', {
      id: req.user.id,
      nome,
      email,
      numero,
      cidade,
      classe
    });

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(req.user.id) },
      data: {
        nome,
        email,
        numero: numeroLimpo,
        cidade,
        classe
      }
    });

    console.log('Usuário atualizado com sucesso:', usuarioAtualizado);
    res.json({ message: "Usuário atualizado com sucesso", usuario: usuarioAtualizado });
  } catch (error) {
    console.error('Erro detalhado ao atualizar usuário:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Este email já está sendo usado por outro usuário" });
    }
    
    res.status(500).json({ 
      error: "Erro ao atualizar usuário",
      details: error.message 
    });
  } 
};

export const excluirUsuario = async (req, res) => {
  try {
     const id = req.user.id; 
    await prisma.usuario.delete({ where: { id: Number(id) } });
    res.json({ message: "Usuário excluído" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
};

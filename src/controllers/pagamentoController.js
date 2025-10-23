import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const criarPagamento = async (req, res) => {
  try {
    const { usuarioId, exameId, metodo, valor, referencia } = req.body;
    const pagamento = await prisma.pagamento.create({ data: { usuarioId: Number(usuarioId), exameId: Number(exameId), metodo, valor: Number(valor), referencia, status: 'pendente' } });
    res.status(201).json({ message: "Pagamento criado", pagamento });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
};

export const listarPagamentos = async (req, res) => {
  try {
    const pagamentos = await prisma.pagamento.findMany();
    res.json(pagamentos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar pagamentos" });
  }
};

export const atualizarStatusPagamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'pendente' | 'pago' | 'falhado'
    const pagamento = await prisma.pagamento.update({ where: { id: Number(id) }, data: { status } });
    res.json({ message: "Status atualizado", pagamento });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar status do pagamento" });
  }
};

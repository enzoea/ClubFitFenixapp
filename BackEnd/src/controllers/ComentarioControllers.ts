import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CreateComentario = async (req: Request, res: Response) => {
  try {
    const { treino_id, usuario_id, comentario } = req.body;

    if (!treino_id || !usuario_id || !comentario || String(comentario).trim().length === 0) {
      return res.status(400).json({ message: "Campos obrigatórios: treino_id, usuario_id, comentario" });
    }

    await prisma.comentario.create({
      data: {
        treino_id: Number(treino_id),
        usuario_id: Number(usuario_id),
        comentario: String(comentario).trim(),
      },
    });

    return res.status(201).json({
      message: "Comentário adicionado com sucesso!",
      comentario: { treino_id, usuario_id, comentario },
    });
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const GetComentariosByTreino = async (req: Request, res: Response) => {
  try {
    const treinoId = Number(req.params.treinoId);

    if (!treinoId) {
      return res.status(400).json({ message: "treinoId inválido" });
    }

    const comentarios = await prisma.comentario.findMany({
      where: { treino_id: treinoId },
      include: { usuario: { select: { nome: true } } },
      orderBy: { id: "asc" },
    });

    const payload = comentarios.map((c) => ({
      id: c.id,
      comentario: c.comentario,
      usuario_nome: c.usuario?.nome || "",
      usuario_foto: undefined,
    }));

    return res.status(200).json({ comentarios: payload });
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    return res.status(500).json({ error: "Erro ao buscar comentários" });
  }
};
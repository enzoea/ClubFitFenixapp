import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { Treinos } from "../models/Treino";

export const RegisterTreino = async (req: Request, res: Response) => {

    const {usuarioId, tipo, inicio, fim, legenda, fotos} = req.body;

    console.log('req.body: ', req.body);

    

    try{

        if (!usuarioId) {
  return res.status(400).json({ error: 'usuarioId é obrigatório' });
}


        const newTreing = await Treinos.PlayTreining({
      usuario_id: Number(usuarioId),
      tipo: String(tipo),
      inicio: new Date(inicio),
      fim: fim ? new Date(fim) : undefined,
      legenda: legenda ?? null,
      fotos: Array.isArray(fotos) ? fotos : [],
    });

        res.status(201).json(newTreing);

    } catch(error){

        console.error("Erro ao cadastrar usuário:", error);
        const MensagemError = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`Error: ${error} ${MensagemError}`);
        res.status(500).json({error: 'Erro ao cadastrar usuario'})

    }
}

export const GetTrainings = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limitQuery = Number(req.query.limit);
    const limit = Math.min(50, Math.max(1, isNaN(limitQuery) ? 10 : limitQuery));
    const skip = (page - 1) * limit;

    const [trainings, total] = await Promise.all([
      prisma.treino.findMany({
        include: {
          usuario: { select: { nome: true } },
          fotos: true,
        },
        orderBy: { inicio: "desc" },
        skip,
        take: limit,
      }),
      prisma.treino.count(),
    ]);

    const items = trainings.map((t: any) => ({
      id: t.id,
      tipo: t.tipo,
      inicio: t.inicio,
      fim: t.fim,
      legenda: t.legenda || null,
      usuario: t.usuario?.nome || "",
      fotoPerfil: undefined,
      fotos: Array.isArray(t.fotos) ? t.fotos.map((f: any) => f.foto_url) : [],
    }));

    console.log('Treinos mapeados para feed (ids -> qtde fotos):', items.map((i: any) => ({ id: i.id, fotos: i.fotos.length })));

    const hasMore = skip + items.length < total;

    res.status(200).json({ items, page, limit, total, hasMore });
  } catch (error) {
    console.error("Erro ao buscar treinos:", error);
    res.status(500).json({ error: "Erro ao buscar treinos" });
  }
};
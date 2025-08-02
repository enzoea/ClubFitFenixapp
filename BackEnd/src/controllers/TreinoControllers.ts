import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { Treinos } from "../models/Treino";

export const RegisterTreino = async (req: Request, res: Response) => {

    const {usuarioId, tipo, inicio, fim, legenda} = req.body;

    console.log('req.body: ', req.body);

    

    try{

        if (!usuarioId) {
  return res.status(400).json({ error: 'usuarioId é obrigatório' });
}


        const newTreing = await Treinos.PlayTreining({
      usuario_id: usuarioId,
      tipo,
      inicio: new Date(inicio),
      fim: fim ? new Date(fim) : undefined,
      legenda,
    });

        res.status(201).json(newTreing);

    } catch(error){

        console.error("Erro ao cadastrar usuário:", error);
        const MensagemError = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`Error: ${error} ${MensagemError}`);
        res.status(500).json({error: 'Erro ao cadastrar usuario'})

    }
}
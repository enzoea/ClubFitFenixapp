import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { Treinos } from "../models/Treino";

export const RegisterTreino = async (req: Request, res: Response) => {

    const {usuario_id, tipo, inicio, fim, legenda} = req.body;

    console.log('req.body: ', req.body);

    try{

        const newTreing = Treinos.PlayTreining({usuario_id, tipo, inicio, fim, legenda});

        res.status(201).json(newTreing);

    } catch(error){

        console.error("Erro ao cadastrar usuário:", error);
        const MensagemError = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`Error: ${error} ${MensagemError}`);
        res.status(500).json({error: 'Erro ao cadastrar usuario'})

    }
}
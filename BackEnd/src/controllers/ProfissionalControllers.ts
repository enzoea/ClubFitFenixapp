import { Request, Response } from "express";
import { Profissional } from "../models/Profissional";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
const secret_key = process.env.JWT_SECRET || 'chave_super_secreta';

export const RegisterProfControllers = async (req: Request, res: Response) => {
    const {nome, telefone, email, dataNascimento, objetivo, senha, registro, profissao} = req.body;
    console.log(`Cadastrando usuario: ${nome} email: ${email} `);
    console.log(`req.body: ${req.body}`);

    if (!nome || !email){
        res.status(400).json({error: 'Nome e email são obrigatório'});
        return;
    }

    try{
        const novoProf = await Profissional.RegisterProf({nome, telefone, email, dataNascimento, objetivo, senha, registro, profissao});
        res.status(201).json(novoProf);

    } catch(error){
        console.error("Erro ao cadastrar usuário", error);
        const MensagemError = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`Error: ${error} ${MensagemError}`);
        res.status(500).json({error: 'Erro ao cadastrar usuario'})
    }

} 
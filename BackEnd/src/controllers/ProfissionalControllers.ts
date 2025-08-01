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

};

export const LoginProfController = async (req: Request , res: Response) => {
    try{

        const {email, senha} = req.body;

        if(!email || !senha){
            return res.status(400).json({ message: 'Email e senha são obrigatório'})
        }

        const login = await Profissional.LoginProf(email);

        if(!login){
            return res.status(404).json({ message: "Usuario não encontrado"})
        }

        console.log(`Senha armazenada no banco: ${login.senha}`);

        const senhaCorreta = await bcrypt.compare(senha, login.senha);

        if(!senhaCorreta){
            return res.status(403).json({ message: 'Senha incorreta'})
        }

        const { senha: _, ...loginSemSenha} = login;

        const token = jwt.sign({id: login.id, email: login.email}, secret_key, { expiresIn: "1h"});

        return res.status(200).json({ user: loginSemSenha, token});



    }catch(error){
        
        console.error("Erro ao fazer login", error);

        return res.status(500).json({ message: "erro interno do servidor"});
    }
};

export const getUserByIdControllers = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);


    try{
        const byid = await Profissional.getUserByID(Number(id));

        if(byid){
            res.json(byid);
            
        }else{
            res.status(404).json({ message: 'Profissional não encontrado'});
        }
    }catch(error){
        res.status(500).json({ message: 'Erro ao buscar ao usuario', error});

    }
}
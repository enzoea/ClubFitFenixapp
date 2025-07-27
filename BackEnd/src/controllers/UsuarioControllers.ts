import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import bcrypto from 'bcrypt';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
const secret_key = process.env.JWT_SECRET || 'chave_super_secreta';

export const RegisterUserController = async (req: Request, res: Response) =>  {
    const {nome, email, senha, objetivo, telefone, dataNascimento} = req.body;
    console.log(`Cadastrando usuario: ${nome}, email: ${email}`);
    console.log('req.body: ', req.body)

    if (!nome || !email){
        res.status(400).json({error: 'Nome e email são obrigatório'});
        return;
    }

    try {
        const novoUser = await Usuario.RegisterUser({nome, email, senha, objetivo, telefone, dataNascimento});
        res.status(201).json(novoUser);

    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        const MensagemError = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`Error: ${error} ${MensagemError}`);
        res.status(500).json({error: 'Erro ao cadastrar usuario'})
    }
};

export const LoginUserController = async (req: Request, res: Response) => {
    try{
        const {email, senha} = req.body;

        if(!email || !senha){
            return res.status(400).json({ message: "Email e senha são obrigatório"});
        }

        const user = await Usuario.LoginUser(email);

        if(!user) {
            return res.status(404).json({ message: "Usuario não encontrado"});
        }

        console.log(`Senha armazenada no banco: ${user.senha}`);

        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if(!senhaCorreta) {
            return res.status(403).json({message: "senha incorreta"})
        }

        const { senha: _, ...userSemSenha} = user;

        const token = jwt.sign({id: user.id, email: user.email}, secret_key, { expiresIn: "1h"}); //aqui gera o token jwt

        return res.status(200).json({ user: userSemSenha, token});




    }catch(error){
        console.error("Erro ao fazer login", error);
        return res.status(500).json({ message: "Erro interno do servidor"});
    }
}
import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
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
        // Trata erro conhecido de unicidade (email já cadastrado) sem depender de tipos específicos do Prisma
        const prismaCode = (error as any)?.code;
        if (prismaCode === 'P2002') {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }

        console.error("Erro ao cadastrar usuário:", error);
        const MensagemError = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`Error: ${MensagemError}`);
        res.status(500).json({ error: 'Erro ao cadastrar usuario' })
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
};

export const getUserByIDControllers = async (req: Request, res: Response) =>{
    const id = parseInt(req.params.id, 10);

    try{
        const user = await Usuario.getUserByID(Number(id));

        if(user){
            res.json(user);

        } else{
            res.status(404).json({ message: 'Usuario não encontrado'});
        }
    }catch(error){
        res.status(500).json({ message: 'Erro ao buscar ao usuario', error})
    }
}

export const UpdateUserControllers = async (req: Request, res: Response) => {

    const id = parseInt(req.params.id);
    const {nome, email, senha, objetivo, telefone, dataNascimento} = req.body;

    try{
        console.log(`Atualizando usuario com id: ${id} `);
        console.log(`Dados recebidos: ${req.body}`)

        if (isNaN(id)) {
  return res.status(400).json({ mensagem: "ID inválido" });
}

        const userAtt = await Usuario.updateUser(id, {nome, email, senha, objetivo, telefone, dataNascimento});
        console.log(`Atualização do usuario ${userAtt}`)

        return res.status(200).json({ mensagem: 'Usuário atualizando com sucesso!', usuario: userAtt});
    } catch(error){
        console.error("Erro ao atualziar o usuario: ", error);
        res.status(500).json({ message: 'Erro ao atualizar o usuario: ', error})
    }
};

export const deleteUserCOntrollers = async(req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const{nome} = req.body;

    try{
        const user = await Usuario.deleteUser(id);
        res.status(200).json({ message: `usuario ${req.body} excluido com sucesso!!`})
        console.log(`Usuario ${nome} excluido com sucesso!`)

        if(!user){
            res.status(400).json({ message: 'Esse usuario não existe'})
        }
    }catch(error){
        res.status(500).json({ message: `Erro ao excluir Usuario ${error}`})
    }
};

export const getUserAllControllers = async(req: Request, res: Response) => {
    try {
        const user = await Usuario.getUserAll();
        
        console.log('Usuarios encontrados:', user);

        res.status(200).json(user);

    } catch(error) {
        console.log(`Error ao buscar usuario: ${error}`);

        res.status(500).json({ message: `Erro aos buscar o usuario ${error}`})
    }
}
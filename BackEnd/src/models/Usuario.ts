import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IUsuario {
    id?: number;
    nome: string;
    email: string;
    senha: string;
    objetivo: string;
    telefone: string;
    dataNascimento: Date ;

    
}

export class Usuario {
    static async RegisterUser(usuarios: IUsuario): Promise<IUsuario> {
        const novoUsuario = await prisma.usuario.create({
            data: {
                nome: usuarios.nome,
                email: usuarios.email,
                senha: usuarios.senha,
                objetivo: usuarios.objetivo,
                telefone: usuarios.telefone,
                dataNascimento: usuarios.dataNascimento 
            }
        });
    console.log(`Usuario ${usuarios.nome} cadastrado com sucesso!`);
    return novoUsuario;
    }

    static async LoginUser(email: string): Promise<IUsuario | null> {
        const user = await prisma.usuario.findUnique({
            where: {email},
        });

        return user;
    }
}
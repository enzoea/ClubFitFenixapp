import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IUsuario {
    id?: number;
    nome: string;
    email: string;
    senha: string;
    objetivo: string;
    telefone: string;
    dataNascimento: Date;

    
}

export class Usuario {
    static async RegisterUser(usuario: IUsuario): Promise<IUsuario> {
        const novoUsuario = await prisma.usuario.create({
            data: {
                nome: usuario.nome,
                email: usuario.email,
                senha: usuario.senha,
                objetivo: usuario.objetivo,
                telefone: usuario.telefone,
                dataNascimento: usuario.dataNascimento
            }
        });
    console.log(`Usuario ${usuario.nome} cadastrado com sucesso!`);
    return novoUsuario;
    }

    static async LoginUser(email: string): Promise<Usuario | null> {
        const user = await prisma.usuario.findUnique({
            where: {email},
        });

        return user;
    }
}
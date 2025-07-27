import { PrismaClient } from "@prisma/client";
import jwt from 'bcrypt';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface IProfissional{
    id?: number,
    nome: string,
    telefone: string,
    email: string,
    dataNascimento: Date,
    objetivo: string,
    senha: string,
    registro: string,
    profissao: string
}

export class Profissional{

    static async RegisterProf (profissionais: IProfissional): Promise<IProfissional>{

        const senhaProtegida = await bcrypt.hash(profissionais.senha, 10);

        const novoProf = await prisma.profissional.create({
            data: {
                nome: profissionais.nome,
                telefone: profissionais.telefone,
                email: profissionais.email,
                dataNascimento: profissionais.dataNascimento,
                objetivo: profissionais.objetivo,
                senha: senhaProtegida,
                registro: profissionais.registro,
                profissao: profissionais.profissao
            }
        });

        console.log(`O ${profissionais.nome} foi adicionado com sucesso!`);
        return novoProf;
    }
}
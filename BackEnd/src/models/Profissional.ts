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

    static async LoginProf (email: string): Promise<IProfissional | null>{
        const user = prisma.profissional.findUnique({where: {email},});
        return user;
    }

    static async getUserByID (id: number): Promise<IProfissional | null>{
        const user = prisma.profissional.findUnique({where: {id}, });
        return user;
    }

    static async uptadeProf (id: number, atualizandoDados: Partial<IProfissional>): Promise<IProfissional> {
        if(atualizandoDados.senha){
            atualizandoDados.senha = await bcrypt.hash(atualizandoDados.senha, 10)

        }

        const userAtt = prisma.profissional.update({
            where: {id},
            data: atualizandoDados,

        })

        return userAtt;
    }

    static async deleleProf (id: number): Promise<IProfissional>{
        const userDelete = prisma.profissional.delete({
            where: {id},
        })

        return userDelete;
    }
}
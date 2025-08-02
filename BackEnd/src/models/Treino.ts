import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

interface ITreino {
    id?: number;
    usuario_id: number;
    tipo: string;
    inicio: Date;
    fim?: Date;
    legenda: string | null;
}

export class Treinos {
    static async PlayTreining(dados: ITreino): Promise<ITreino> {

        const novoTreino = await prisma.treino.create({
            data: {
                usuario_id: dados.usuario_id,
                tipo: dados.tipo,
                inicio: new Date(),
                fim: new Date(),
                legenda: dados.legenda

            }
        });

        console.log(`Treino iniciado pelo usuario ${dados.usuario_id}`);

        return novoTreino;
    }
}



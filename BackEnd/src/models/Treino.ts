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
        console.log('dados.usuario_id dentro do PlayTreining:', dados.usuario_id);

        

        const novoTreino = await prisma.treino.create({
            data: {
                tipo: dados.tipo,
                inicio: new Date(),
                fim: new Date(),
                legenda: dados.legenda,
                usuario:{
                    connect: { id: dados.usuario_id}
                }

            }
        });

        console.log(`Treino iniciado pelo usuario ${dados.usuario_id}`);

        return novoTreino;
    }
}



import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

interface ITreino {
    id?: number;
    usuario_id: number;
    tipo: string;
    inicio: Date;
    fim?: Date;
    legenda: string | null;
    fotos?: string[];
}

export class Treinos {
    static async PlayTreining(dados: ITreino): Promise<ITreino> {
        console.log('dados.usuario_id dentro do PlayTreining:', dados.usuario_id);
        console.log('URLs de fotos recebidas no PlayTreining:', Array.isArray(dados.fotos) ? dados.fotos : []);

        

        const novoTreino = await prisma.treino.create({
            data: {
                tipo: dados.tipo,
                inicio: dados.inicio instanceof Date ? dados.inicio : new Date(dados.inicio),
                fim: dados.fim ? (dados.fim instanceof Date ? dados.fim : new Date(dados.fim)) : new Date(),
                legenda: dados.legenda ?? null,
                usuario:{
                    connect: { id: dados.usuario_id}
                },
                fotos: {
                    create: Array.isArray(dados.fotos)
                        ? dados.fotos.map((url) => ({ foto_url: url }))
                        : []
                }

            }
        });

        console.log(`Treino iniciado pelo usuario ${dados.usuario_id}`);
        try {
            const fotosCriadas = await prisma.treinoFoto.findMany({ where: { treino_id: novoTreino.id } });
            console.log('Fotos persistidas para o treino:', fotosCriadas.map((f: { foto_url: string }) => f.foto_url));
        } catch(err) {
            console.warn('Não foi possível recuperar fotos criadas:', err);
        }

        return novoTreino;
    }
}



"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Treinos = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Treinos {
    static PlayTreining(dados) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log('dados.usuario_id dentro do PlayTreining:', dados.usuario_id);
            console.log('URLs de fotos recebidas no PlayTreining:', Array.isArray(dados.fotos) ? dados.fotos : []);
            const novoTreino = yield prisma.treino.create({
                data: {
                    tipo: dados.tipo,
                    inicio: dados.inicio instanceof Date ? dados.inicio : new Date(dados.inicio),
                    fim: dados.fim ? (dados.fim instanceof Date ? dados.fim : new Date(dados.fim)) : new Date(),
                    legenda: (_a = dados.legenda) !== null && _a !== void 0 ? _a : null,
                    usuario: {
                        connect: { id: dados.usuario_id }
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
                const fotosCriadas = yield prisma.treinoFoto.findMany({ where: { treino_id: novoTreino.id } });
                console.log('Fotos persistidas para o treino:', fotosCriadas.map((f) => f.foto_url));
            }
            catch (err) {
                console.warn('Não foi possível recuperar fotos criadas:', err);
            }
            return novoTreino;
        });
    }
}
exports.Treinos = Treinos;

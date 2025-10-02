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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTrainings = exports.RegisterTreino = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const Treino_1 = require("../models/Treino");
const RegisterTreino = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuarioId, tipo, inicio, fim, legenda, fotos } = req.body;
    console.log('req.body: ', req.body);
    try {
        if (!usuarioId) {
            return res.status(400).json({ error: 'usuarioId é obrigatório' });
        }
        const newTreing = yield Treino_1.Treinos.PlayTreining({
            usuario_id: Number(usuarioId),
            tipo: String(tipo),
            inicio: new Date(inicio),
            fim: fim ? new Date(fim) : undefined,
            legenda: legenda !== null && legenda !== void 0 ? legenda : null,
            fotos: Array.isArray(fotos) ? fotos : [],
        });
        res.status(201).json(newTreing);
    }
    catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        const MensagemError = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`Error: ${error} ${MensagemError}`);
        res.status(500).json({ error: 'Erro ao cadastrar usuario' });
    }
});
exports.RegisterTreino = RegisterTreino;
const GetTrainings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limitQuery = Number(req.query.limit);
        const limit = Math.min(50, Math.max(1, isNaN(limitQuery) ? 10 : limitQuery));
        const skip = (page - 1) * limit;
        const [trainings, total] = yield Promise.all([
            prisma_1.default.treino.findMany({
                include: {
                    usuario: { select: { nome: true } },
                    fotos: true,
                },
                orderBy: { inicio: "desc" },
                skip,
                take: limit,
            }),
            prisma_1.default.treino.count(),
        ]);
        const items = trainings.map((t) => {
            var _a;
            return ({
                id: t.id,
                tipo: t.tipo,
                inicio: t.inicio,
                fim: t.fim,
                legenda: t.legenda || null,
                usuario: ((_a = t.usuario) === null || _a === void 0 ? void 0 : _a.nome) || "",
                fotoPerfil: undefined,
                fotos: Array.isArray(t.fotos) ? t.fotos.map((f) => f.foto_url) : [],
            });
        });
        console.log('Treinos mapeados para feed (ids -> qtde fotos):', items.map((i) => ({ id: i.id, fotos: i.fotos.length })));
        const hasMore = skip + items.length < total;
        res.status(200).json({ items, page, limit, total, hasMore });
    }
    catch (error) {
        console.error("Erro ao buscar treinos:", error);
        res.status(500).json({ error: "Erro ao buscar treinos" });
    }
});
exports.GetTrainings = GetTrainings;

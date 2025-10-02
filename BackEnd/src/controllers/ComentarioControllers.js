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
exports.GetComentariosByTreino = exports.CreateComentario = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const CreateComentario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { treino_id, usuario_id, comentario } = req.body;
        if (!treino_id || !usuario_id || !comentario || String(comentario).trim().length === 0) {
            return res.status(400).json({ message: "Campos obrigatórios: treino_id, usuario_id, comentario" });
        }
        yield prisma.comentario.create({
            data: {
                treino_id: Number(treino_id),
                usuario_id: Number(usuario_id),
                comentario: String(comentario).trim(),
            },
        });
        return res.status(201).json({
            message: "Comentário adicionado com sucesso!",
            comentario: { treino_id, usuario_id, comentario },
        });
    }
    catch (error) {
        console.error("Erro ao adicionar comentário:", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
});
exports.CreateComentario = CreateComentario;
const GetComentariosByTreino = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const treinoId = Number(req.params.treinoId);
        if (!treinoId) {
            return res.status(400).json({ message: "treinoId inválido" });
        }
        const comentarios = yield prisma.comentario.findMany({
            where: { treino_id: treinoId },
            include: { usuario: { select: { nome: true } } },
            orderBy: { id: "asc" },
        });
        const payload = comentarios.map((c) => {
            var _a;
            return ({
                id: c.id,
                comentario: c.comentario,
                usuario_nome: ((_a = c.usuario) === null || _a === void 0 ? void 0 : _a.nome) || "",
                usuario_foto: undefined,
            });
        });
        return res.status(200).json({ comentarios: payload });
    }
    catch (error) {
        console.error("Erro ao buscar comentários:", error);
        return res.status(500).json({ error: "Erro ao buscar comentários" });
    }
});
exports.GetComentariosByTreino = GetComentariosByTreino;

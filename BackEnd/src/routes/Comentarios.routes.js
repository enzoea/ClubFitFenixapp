"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ComentarioControllers_1 = require("../controllers/ComentarioControllers");
const Auth_1 = require("../middleware/Auth");
const comentariosRouter = express_1.default.Router();
// POST /api/comentarios (protegido)
comentariosRouter.post('/', Auth_1.VerificarToken, ComentarioControllers_1.CreateComentario);
// GET /api/comentarios/:treinoId
comentariosRouter.get('/:treinoId', ComentarioControllers_1.GetComentariosByTreino);
exports.default = comentariosRouter;

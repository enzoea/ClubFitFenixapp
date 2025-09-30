import Express from "express";
import { CreateComentario, GetComentariosByTreino } from "../controllers/ComentarioControllers";
import { VerificarToken } from "../middleware/Auth";

const comentariosRouter = Express.Router();

// POST /api/comentarios (protegido)
comentariosRouter.post('/', VerificarToken, CreateComentario);

// GET /api/comentarios/:treinoId
comentariosRouter.get('/:treinoId', GetComentariosByTreino);

export default comentariosRouter;
import { Router } from "express";
import userRouter from "./Usuario.routes";
import Profrouter from "./Profissional.routes";
import Treinrouter from "./Treinos.routes";
import comentariosRouter from "./Comentarios.routes";
import { GetTrainings } from "../controllers/TreinoControllers";

const router = Router();

router.use('/user/', userRouter);
router.use('/prof/', Profrouter);
router.use('/training', Treinrouter);
router.use('/comentarios', comentariosRouter);

// Lista de treinos para o feed
router.get('/trainings', GetTrainings);

export default router;
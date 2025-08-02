import { Router } from "express";
import userRouter from "./Usuario.routes";
import Profrouter from "./Profissional.routes";
import Treinrouter from "./Treinos.routes";

const router = Router();

router.use('/user/', userRouter);
router.use('/prof/', Profrouter);
router.use('/training', Treinrouter);

export default router;
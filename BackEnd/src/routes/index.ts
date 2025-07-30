import { Router } from "express";
import userRouter from "./Usuario.routes";
import Profrouter from "./Profissional.routes";

const router = Router();

router.use('/user/', userRouter);
router.use('/prof/', Profrouter);

export default router;
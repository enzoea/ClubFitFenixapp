import  Express  from "express";
import { RegisterUserController, LoginUserController } from "../controllers/UsuarioControllers";

const router = Express.Router();

router.post('/user/register', RegisterUserController);
router.post('/user/login', LoginUserController);

export default router



import  Express  from "express";
import { RegisterUserController } from "../controllers/UsuarioControllers";

const router = Express.Router();

router.post('user/register', RegisterUserController);

export default router



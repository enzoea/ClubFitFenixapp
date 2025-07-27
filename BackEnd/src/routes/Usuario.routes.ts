import  Express  from "express";
import { RegisterUserController, LoginUserController, getUserByIDControllers } from "../controllers/UsuarioControllers";

const router = Express.Router();

router.post('/user/register', RegisterUserController);
router.post('/user/login', LoginUserController);
router.get('/user/:id', getUserByIDControllers);

export default router



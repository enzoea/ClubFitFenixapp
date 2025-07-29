import  Express  from "express";
import { RegisterUserController, LoginUserController, getUserByIDControllers, UpdateProfControllers } from "../controllers/UsuarioControllers";

const router = Express.Router();

router.post('/user/register', RegisterUserController);
router.post('/user/login', LoginUserController);
router.get('/user/:id', getUserByIDControllers);
router.put('/user/update/:id', UpdateProfControllers);

export default router



import  Express  from "express";
import { RegisterUserController, LoginUserController, getUserByIDControllers, UpdateProfControllers } from "../controllers/UsuarioControllers";

const userRouter = Express.Router();

userRouter.post('/register', RegisterUserController);
userRouter.post('/login', LoginUserController);
userRouter.get('/:id', getUserByIDControllers);
userRouter.put('/update/:id', UpdateProfControllers);

export default userRouter;



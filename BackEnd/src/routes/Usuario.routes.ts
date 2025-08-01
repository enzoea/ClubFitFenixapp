import  Express  from "express";
import { RegisterUserController, LoginUserController, getUserByIDControllers, UpdateProfControllers, deleteUserCOntrollers,getUserAllControllers } from "../controllers/UsuarioControllers";

const userRouter = Express.Router();

userRouter.post('/register', RegisterUserController);
userRouter.post('/login', LoginUserController);
userRouter.get('/:id', getUserByIDControllers);
userRouter.get('/alluser', getUserAllControllers);
userRouter.put('/update/:id', UpdateProfControllers);
userRouter.delete('/delete/:id', deleteUserCOntrollers);

export default userRouter;



import  Express  from "express";
import { RegisterProfControllers, LoginProfController,getUserByIdControllers } from "../controllers/ProfissionalControllers";

const Profrouter = Express.Router();

Profrouter.post('/register', RegisterProfControllers);
Profrouter.post('/login', LoginProfController);
Profrouter.get('/:id', getUserByIdControllers);

export default Profrouter
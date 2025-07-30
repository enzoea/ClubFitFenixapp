import  Express  from "express";
import { RegisterProfControllers, LoginProfController } from "../controllers/ProfissionalControllers";

const Profrouter = Express.Router();

Profrouter.post('/register', RegisterProfControllers);
Profrouter.post('/login', LoginProfController);

export default Profrouter
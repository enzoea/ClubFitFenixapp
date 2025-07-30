import  Express  from "express";
import { RegisterProfControllers } from "../controllers/ProfissionalControllers";

const Profrouter = Express.Router();

Profrouter.post('/register', RegisterProfControllers);

export default Profrouter
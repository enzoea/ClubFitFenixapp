import  Express  from "express";
import { RegisterProfControllers, LoginProfController,getUserByIdControllers, deleteUserCOntrollers, UpdateUserControllers } from "../controllers/ProfissionalControllers";


const Profrouter = Express.Router();

Profrouter.post('/register', RegisterProfControllers);
Profrouter.post('/login', LoginProfController);
Profrouter.get('/:id', getUserByIdControllers);
Profrouter.put('/update/:id', UpdateUserControllers);
Profrouter.delete('/delete/:id', deleteUserCOntrollers);
export default Profrouter
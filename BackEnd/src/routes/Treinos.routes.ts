import  Express  from "express";
import { RegisterTreino } from "../controllers/TreinoControllers";

const Treinrouter = Express.Router();

Treinrouter.post('/register', RegisterTreino);

export default Treinrouter;
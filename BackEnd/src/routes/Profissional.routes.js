"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProfissionalControllers_1 = require("../controllers/ProfissionalControllers");
const Profrouter = express_1.default.Router();
Profrouter.post('/register', ProfissionalControllers_1.RegisterProfControllers);
Profrouter.post('/login', ProfissionalControllers_1.LoginProfController);
Profrouter.get('/:id', ProfissionalControllers_1.getUserByIdControllers);
Profrouter.put('/update/:id', ProfissionalControllers_1.UpdateUserControllers);
Profrouter.delete('/delete/:id', ProfissionalControllers_1.deleteUserCOntrollers);
exports.default = Profrouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UsuarioControllers_1 = require("../controllers/UsuarioControllers");
const userRouter = express_1.default.Router();
userRouter.post('/register', UsuarioControllers_1.RegisterUserController);
userRouter.post('/login', UsuarioControllers_1.LoginUserController);
userRouter.get('/:id', UsuarioControllers_1.getUserByIDControllers);
userRouter.get('/alluser', UsuarioControllers_1.getUserAllControllers);
userRouter.put('/update/:id', UsuarioControllers_1.UpdateUserControllers);
userRouter.delete('/delete/:id', UsuarioControllers_1.deleteUserCOntrollers);
exports.default = userRouter;

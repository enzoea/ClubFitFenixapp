"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TreinoControllers_1 = require("../controllers/TreinoControllers");
const Treinrouter = express_1.default.Router();
Treinrouter.post('/register', TreinoControllers_1.RegisterTreino);
exports.default = Treinrouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Usuario_routes_1 = __importDefault(require("./Usuario.routes"));
const Profissional_routes_1 = __importDefault(require("./Profissional.routes"));
const Treinos_routes_1 = __importDefault(require("./Treinos.routes"));
const Comentarios_routes_1 = __importDefault(require("./Comentarios.routes"));
const TreinoControllers_1 = require("../controllers/TreinoControllers");
const router = (0, express_1.Router)();
router.use('/user/', Usuario_routes_1.default);
router.use('/prof/', Profissional_routes_1.default);
router.use('/training', Treinos_routes_1.default);
router.use('/comentarios', Comentarios_routes_1.default);
// Lista de treinos para o feed
router.get('/trainings', TreinoControllers_1.GetTrainings);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificarToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_key = process.env.JWT_SECRET || 'chave_super_secreta';
const VerificarToken = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace(/^Bearer\s+/i, "");
    if (!token) {
        res.status(401).json({ message: 'Acesso negado, token não fornecido' });
        return;
    }
    jsonwebtoken_1.default.verify(token, secret_key, (err, decoded) => {
        if (err)
            return res.status(403).json({ mensagem: 'token inválido' });
        // Anexa o payload do token na requisição de forma consistente
        req.user = decoded;
        next();
    });
};
exports.VerificarToken = VerificarToken;

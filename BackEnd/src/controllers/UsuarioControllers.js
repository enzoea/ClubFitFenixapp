"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAllControllers = exports.deleteUserCOntrollers = exports.UpdateUserControllers = exports.getUserByIDControllers = exports.LoginUserController = exports.RegisterUserController = void 0;
const Usuario_1 = require("../models/Usuario");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_key = process.env.JWT_SECRET || 'chave_super_secreta';
const RegisterUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, email, senha, objetivo, telefone, dataNascimento } = req.body;
    console.log(`Cadastrando usuario: ${nome}, email: ${email}`);
    console.log('req.body: ', req.body);
    if (!nome || !email) {
        res.status(400).json({ error: 'Nome e email são obrigatório' });
        return;
    }
    try {
        const novoUser = yield Usuario_1.Usuario.RegisterUser({ nome, email, senha, objetivo, telefone, dataNascimento });
        res.status(201).json(novoUser);
    }
    catch (error) {
        // Trata erro conhecido de unicidade (email já cadastrado) sem depender de tipos específicos do Prisma
        const prismaCode = error === null || error === void 0 ? void 0 : error.code;
        if (prismaCode === 'P2002') {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }
        console.error("Erro ao cadastrar usuário:", error);
        const MensagemError = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`Error: ${MensagemError}`);
        res.status(500).json({ error: 'Erro ao cadastrar usuario' });
    }
});
exports.RegisterUserController = RegisterUserController;
const LoginUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatório" });
        }
        const user = yield Usuario_1.Usuario.LoginUser(email);
        if (!user) {
            return res.status(404).json({ message: "Usuario não encontrado" });
        }
        console.log(`Senha armazenada no banco: ${user.senha}`);
        const senhaCorreta = yield bcrypt_1.default.compare(senha, user.senha);
        if (!senhaCorreta) {
            return res.status(403).json({ message: "senha incorreta" });
        }
        const { senha: _ } = user, userSemSenha = __rest(user, ["senha"]);
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, secret_key, { expiresIn: "1h" }); //aqui gera o token jwt
        return res.status(200).json({ user: userSemSenha, token });
    }
    catch (error) {
        console.error("Erro ao fazer login", error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
});
exports.LoginUserController = LoginUserController;
const getUserByIDControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    try {
        const user = yield Usuario_1.Usuario.getUserByID(Number(id));
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: 'Usuario não encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar ao usuario', error });
    }
});
exports.getUserByIDControllers = getUserByIDControllers;
const UpdateUserControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { nome, email, senha, objetivo, telefone, dataNascimento } = req.body;
    try {
        console.log(`Atualizando usuario com id: ${id} `);
        console.log(`Dados recebidos: ${req.body}`);
        if (isNaN(id)) {
            return res.status(400).json({ mensagem: "ID inválido" });
        }
        const userAtt = yield Usuario_1.Usuario.updateUser(id, { nome, email, senha, objetivo, telefone, dataNascimento });
        console.log(`Atualização do usuario ${userAtt}`);
        return res.status(200).json({ mensagem: 'Usuário atualizando com sucesso!', usuario: userAtt });
    }
    catch (error) {
        console.error("Erro ao atualziar o usuario: ", error);
        res.status(500).json({ message: 'Erro ao atualizar o usuario: ', error });
    }
});
exports.UpdateUserControllers = UpdateUserControllers;
const deleteUserCOntrollers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { nome } = req.body;
    try {
        const user = yield Usuario_1.Usuario.deleteUser(id);
        res.status(200).json({ message: `usuario ${req.body} excluido com sucesso!!` });
        console.log(`Usuario ${nome} excluido com sucesso!`);
        if (!user) {
            res.status(400).json({ message: 'Esse usuario não existe' });
        }
    }
    catch (error) {
        res.status(500).json({ message: `Erro ao excluir Usuario ${error}` });
    }
});
exports.deleteUserCOntrollers = deleteUserCOntrollers;
const getUserAllControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield Usuario_1.Usuario.getUserAll();
        console.log('Usuarios encontrados:', user);
        res.status(200).json(user);
    }
    catch (error) {
        console.log(`Error ao buscar usuario: ${error}`);
        res.status(500).json({ message: `Erro aos buscar o usuario ${error}` });
    }
});
exports.getUserAllControllers = getUserAllControllers;

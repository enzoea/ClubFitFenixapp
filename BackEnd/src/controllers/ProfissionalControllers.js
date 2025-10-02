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
exports.deleteUserCOntrollers = exports.UpdateUserControllers = exports.getUserByIdControllers = exports.LoginProfController = exports.RegisterProfControllers = void 0;
const Profissional_1 = require("../models/Profissional");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_key = process.env.JWT_SECRET || 'chave_super_secreta';
const RegisterProfControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nome, telefone, email, dataNascimento, objetivo, senha, registro, profissao } = req.body;
    console.log(`Cadastrando usuario: ${nome} email: ${email} `);
    console.log(`req.body: ${req.body}`);
    if (!nome || !email) {
        res.status(400).json({ error: 'Nome e email são obrigatório' });
        return;
    }
    try {
        const novoProf = yield Profissional_1.Profissional.RegisterProf({ nome, telefone, email, dataNascimento, objetivo, senha, registro, profissao });
        res.status(201).json(novoProf);
    }
    catch (error) {
        console.error("Erro ao cadastrar usuário", error);
        const MensagemError = error instanceof Error ? error.message : 'Erro desconhecido';
        console.log(`Error: ${error} ${MensagemError}`);
        res.status(500).json({ error: 'Erro ao cadastrar usuario' });
    }
});
exports.RegisterProfControllers = RegisterProfControllers;
const LoginProfController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatório' });
        }
        const login = yield Profissional_1.Profissional.LoginProf(email);
        if (!login) {
            return res.status(404).json({ message: "Usuario não encontrado" });
        }
        console.log(`Senha armazenada no banco: ${login.senha}`);
        const senhaCorreta = yield bcrypt_1.default.compare(senha, login.senha);
        if (!senhaCorreta) {
            return res.status(403).json({ message: 'Senha incorreta' });
        }
        const { senha: _ } = login, loginSemSenha = __rest(login, ["senha"]);
        const token = jsonwebtoken_1.default.sign({ id: login.id, email: login.email }, secret_key, { expiresIn: "1h" });
        return res.status(200).json({ user: loginSemSenha, token });
    }
    catch (error) {
        console.error("Erro ao fazer login", error);
        return res.status(500).json({ message: "erro interno do servidor" });
    }
});
exports.LoginProfController = LoginProfController;
const getUserByIdControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id, 10);
    try {
        const byid = yield Profissional_1.Profissional.getUserByID(Number(id));
        if (byid) {
            res.json(byid);
        }
        else {
            res.status(404).json({ message: 'Profissional não encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar ao usuario', error });
    }
});
exports.getUserByIdControllers = getUserByIdControllers;
const UpdateUserControllers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { nome, telefone, email, dataNascimento, objetivo, senha, registro, profissao } = req.body;
    try {
        console.log(`Atualizando usuario com id: ${id} `);
        console.log(`Dados recebidos: ${req.body}`);
        if (isNaN(id)) {
            return res.status(400).json({ mensagem: "ID inválido" });
        }
        const userAtt = yield Profissional_1.Profissional.uptadeProf(id, { nome, telefone, email, dataNascimento, objetivo, senha, registro, profissao });
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
        const user = yield Profissional_1.Profissional.deleleProf(id);
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

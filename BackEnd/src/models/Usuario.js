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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
class Usuario {
    static RegisterUser(usuarios) {
        return __awaiter(this, void 0, void 0, function* () {
            const senhaCriptogradada = yield bcrypt_1.default.hash(usuarios.senha, 10);
            const novoUsuario = yield prisma.usuario.create({
                data: {
                    nome: usuarios.nome,
                    email: usuarios.email,
                    senha: senhaCriptogradada,
                    objetivo: usuarios.objetivo,
                    telefone: usuarios.telefone,
                    dataNascimento: usuarios.dataNascimento
                }
            });
            console.log(`Usuario ${usuarios.nome} cadastrado com sucesso!`);
            return novoUsuario;
        });
    }
    static LoginUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.usuario.findUnique({
                where: { email },
            });
            return user;
        });
    }
    static getUserByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.usuario.findUnique({
                where: { id },
            });
            return user;
        });
    }
    static getUserAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma.usuario.findMany();
            console.log(`Usuarios encontrados ${user}`);
            return user;
        });
    }
    static updateUser(id, dadosAtualizados) {
        return __awaiter(this, void 0, void 0, function* () {
            if (dadosAtualizados.senha) {
                dadosAtualizados.senha = yield bcrypt_1.default.hash(dadosAtualizados.senha, 10);
            }
            const userAtualizado = yield prisma.usuario.update({
                where: { id },
                data: dadosAtualizados,
            });
            return userAtualizado;
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDelete = prisma.usuario.delete({
                where: { id }
            });
            return userDelete;
        });
    }
}
exports.Usuario = Usuario;

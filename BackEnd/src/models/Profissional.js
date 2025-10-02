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
exports.Profissional = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
class Profissional {
    static RegisterProf(profissionais) {
        return __awaiter(this, void 0, void 0, function* () {
            const senhaProtegida = yield bcrypt_1.default.hash(profissionais.senha, 10);
            const novoProf = yield prisma.profissional.create({
                data: {
                    nome: profissionais.nome,
                    telefone: profissionais.telefone,
                    email: profissionais.email,
                    dataNascimento: profissionais.dataNascimento,
                    objetivo: profissionais.objetivo,
                    senha: senhaProtegida,
                    registro: profissionais.registro,
                    profissao: profissionais.profissao
                }
            });
            console.log(`O ${profissionais.nome} foi adicionado com sucesso!`);
            return novoProf;
        });
    }
    static LoginProf(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = prisma.profissional.findUnique({ where: { email }, });
            return user;
        });
    }
    static getUserByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = prisma.profissional.findUnique({ where: { id }, });
            return user;
        });
    }
    static uptadeProf(id, atualizandoDados) {
        return __awaiter(this, void 0, void 0, function* () {
            if (atualizandoDados.senha) {
                atualizandoDados.senha = yield bcrypt_1.default.hash(atualizandoDados.senha, 10);
            }
            const userAtt = prisma.profissional.update({
                where: { id },
                data: atualizandoDados,
            });
            return userAtt;
        });
    }
    static deleleProf(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDelete = prisma.profissional.delete({
                where: { id },
            });
            return userDelete;
        });
    }
}
exports.Profissional = Profissional;

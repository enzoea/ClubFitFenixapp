import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";

const secret_key = process.env.JWT_SECRET || 'chave_super_secreta';

interface JwtPayload{
    id: number,
    email: string
}

export const VerificarToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer", "");

    if(!token){
        res.status(401).json({message: 'Acesso negado, token não fornecido'});
        return;
    }

    jwt.verify(token, secret_key, (err, decoded) =>{
        if(err) return res.status(403).json({mensagem: 'token inválido'});

        req.body.usuario = decoded as JwtPayload;
        next();
    })

}
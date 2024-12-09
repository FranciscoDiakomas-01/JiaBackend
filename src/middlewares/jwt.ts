import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {Request , Response , NextFunction} from 'express'
dotenv.config()
import CryptoJS from 'crypto-js'
import db from '../database/dbConection'
export interface IPayLoad {
    id: number
}
export function geretateToken(payload : IPayLoad) {
    const token = jwt.sign(payload, String(process.env.JWT));
    return token
}

export function getIdIndToken(token : string){
    return jwt.verify(token, String(process.env.JWT), (err, payload) => {
      if (err) {
        return false;
      } else {
        const result  = payload as IPayLoad
        return result;
      }
    });
}

export async function VerifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        const encodedToken = req.headers['authorization'] as string;
        const token = CryptoJS.AES.decrypt(encodedToken, String(process.env.ENC_TOKEN)).toString(CryptoJS.enc.Utf8)
        if (token?.length == 0) {
            res.status(401).json({
              error: "token not provided",
            });
            return;
        }
        jwt.verify(token, String(process.env.JWT), async(err, payload) => {
            if (err) {
                res.status(401).json({
                    error : 'wrong token'
                })
                return
            } else {
                const userId = getIdIndToken(token);
                const { rowCount } = await db.query("SELECT id FROM users WHERE id = $1 LIMIT 1;", [userId])
                if (rowCount == 1) {
                    req.user = userId;
                    next()
                    return 
                } else {
                    res.status(401).json({
                    error: "user not found",
                    });
                    return
                }
            }
            
        });
    } catch (error) {
        res.status(401).json({
          error: "token not provided",
        });
        return;
    }
    
}
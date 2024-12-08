import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {Request , Response , NextFunction} from 'express'
dotenv.config()

export interface IPayLoad {
    id: number,
    password : number
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
        return result.id;
      }
    });
}

export function VerifyToken(req: Request, res: Response, next: NextFunction) {
    try {
        const token = String(req.headers['authorization'])
        if (token?.length == 0) {
            res.status(401).json({
              error: "token not provided",
            });
            return;
        }
        jwt.verify(token, String(process.env.JWT), (err, payload) => {
            if (err) {
                res.status(401).json({
                    error : 'wrong token'
                })
                return
            } else {
                next()
                return
            }
            
        });
    } catch (error) {
        
    }
    
}
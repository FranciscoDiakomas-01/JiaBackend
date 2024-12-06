import validator from 'validator'
import IUser from '../@types/User.type'
import CryptoJS from 'crypto-js'
import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

// User Validation
export function CanCreateUser(user : IUser) : boolean {
    try {
        if (validator.isEmail(user.email) && user.password.length >= 8 && user.name && user.lastname) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

interface IResetPassword {
    id: number,
    oldPassword: string,
    newPassword : string
}
export async function CanResetPassword(reset : IResetPassword , db : Pool) : boolean {
    try {
        const { rowCount , rows } =  await db.query('SELECT id , password FROM users WHERE id = $1 LIMIT 1;' , [reset.id])
        if (rowCount != 0) {
            const decrypedPassword = CryptoJS.AES.decrypt(String(rows[0].password), String(process.env.ENC_PASS)).toString(CryptoJS.enc.Utf8)
            if (decrypedPassword == reset.oldPassword) {
                
            }
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}
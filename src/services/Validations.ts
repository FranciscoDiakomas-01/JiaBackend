import validator from 'validator'
import IUser from '../@types/User.type'
import CryptoJS from 'crypto-js'
import dotenv from 'dotenv'
import { hasEmpty } from './util'
import db from '../database/dbConection'
import IPOst from '../@types/Post.type'
import IComment from '../@types/Comment.type'
dotenv.config()



// User Validation

export async function isOwnerAcount(userId : number , passowrd : string , email : string )  : Promise<boolean>{
    
    try {
        if (!userId || isNaN(userId) || !passowrd || !email || !validator.isEmail(email) || passowrd?.length < 8) {
        return false
    } else {
        //compare passwords
        const response = await db.query('SELECT password FROM users WHERE id = $1 AND email = $2', [userId, email])
        if (response.rowCount != 0 || response.rowCount != null) {
            //found a acount
            const decrypedPassword = CryptoJS.AES.decrypt(String(response.rows[0].password), String(process.env.ENC_PASS)).toString(CryptoJS.enc.Utf8)
            if (decrypedPassword == passowrd) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
        return false
    } catch (error) {
         return false;
    }
    
}


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

export function CanUpdateUser(user : Required<IUser>) : boolean {
    try {
        if (validator.isEmail(user.email) && user.name && user.lastname && user.bio?.length <= 100) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}



export interface IAuthorization {
  id: number;
  oldPassword: string;
  newPassword?: string;
}

export async function HasPermitionToModify(reset : IAuthorization) : Promise<boolean | string>{
    try {
        return new Promise((resolve, reject) => {
            if (reset.oldPassword?.length  <  8) {
                reject("invalid password");
                return;
            }
            if (hasEmpty(reset)) {
                reject("body can´t contain empty field");
                return
            }
            db.query("SELECT id , password FROM users WHERE id = $1 LIMIT 1;", [reset.id], (err, data) => {
                if (err) {
                    reject(err.message)
                    return
                }
                if (data?.rowCount != 0) {
                    const decrypedPassword = CryptoJS.AES.decrypt(String(data.rows[0].password), String(process.env.ENC_PASS)).toString(CryptoJS.enc.Utf8)
                    if (decrypedPassword == reset.oldPassword) {
                        resolve(true)
                        return;
                    } else {
                        reject('password doens´t matches')
                        return
                    }
                } else {
                    reject('user not found')
                    return
                }
         })
        })
        
    } catch (error) {
        return false
    }
}



// Post Validation
export function CanCreatePost(post: IPOst): boolean  {
    try {
        if (post.text && post.text?.length <= 500 && post.title && !isNaN(post.userid)) {
           
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

export async function isPostOwner(id : number , userid : number): Promise<boolean> {
    try {
        const { rowCount } = await db.query("SELECT * FROM post WHERE id = $1 AND userid = $2 LIMIT 1;", [id, userid]);
        
        if (rowCount != 0 && rowCount != null) {
            return true;
        } else {
            return false;
        }
  } catch (error) {
            console.log(false);
    return false;
  }
}



// Like Validation

export async function CanLike(userid: number, postid: number) {
        if (isNaN(userid) || isNaN(postid) || !postid || !userid) {
            return false
        }
    const { rowCount } = await db.query('SELECT id FROM likes WHERE postid = $1 AND userid = $2;', [postid, userid])
    return rowCount == 0 ? true : false
    
}

export async function CanDeslike(userid: number, postid: number) {
    if (isNaN(userid) || isNaN(postid) || !postid || !userid) {
        return false
    }
    const { rowCount } = await db.query('SELECT id FROM likes WHERE postid = $1 AND userid = $2;', [postid, userid])
    return rowCount == 0 ? false : true
    
}


// Comment Validation

export async function CanComment(comment : IComment) {
    try {
        if (!isNaN(comment.userid) && !isNaN(comment.postid) && comment.text.length <= 200) {
            const { rowCount } = await db.query("SELECT * FROM post WHERE id = $1 LIMIT 1;", [comment.postid]);
            if (rowCount == 1) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

export async function CanChangeComment( userid : number , commentid : number , postid : number = -1) : Promise<boolean>{
    try {
        
        if (!isNaN(userid) && !isNaN(commentid)) {
            //!verificando se é dono do comentário
            const { rowCount } = await db.query("SELECT id FROM comment WHERE userid = $1  AND id = $2 LIMIT 1;", [userid, commentid]);
            if (rowCount == 1) {
                return true
            } else {
                //*caso seje dono da publicação
                if(postid < 0){
                    return false
                }
                 const { rowCount } = await db.query("SELECT id FROM post WHERE userid = $1  AND id = $2 LIMIT 1;", [userid, postid]);
                 return rowCount == 1
            }
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}
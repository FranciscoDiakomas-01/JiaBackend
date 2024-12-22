import db from "../database/dbConection";
import IUser from "../@types/User.type";
import dotenv from 'dotenv'
import CryptoJS from "crypto-js";
import { ILogin } from "../controllers/UserController";
import validator from 'validator'

dotenv.config()

export default class UserModel {
  private sqlQuery: string = "";
  public async create(user: IUser) {
    const password = CryptoJS.AES.encrypt(user.password,String(process.env.ENC_PASS)).toString();
    this.sqlQuery ="INSERT INTO users(name , lastname , email , password) VALUES($1 , $2 , $3 , $4) RETURNING id;";
    return new Promise((resolve, reject) => {
      db.query(this.sqlQuery,[user.name.toLowerCase(), user.lastname.toLocaleLowerCase(), user.email, password],(err, result) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(result.rows[0].id);
          }
        }
      );
    });
  }
  public async login(login : ILogin) {
    return new Promise((resolve, reject) => {
      if (!validator.isEmail(login.email) || login.password.length < 8) {
        reject('invalid email or password')
        return
      }
      this.sqlQuery = "SELECT email , id , password FROM users WHERE email = $1 LIMIT 1";
      db.query(this.sqlQuery, [login.email], (err, result) => {
        if (result.rowCount == 0 || result.rowCount == null) {
          reject('acount not found')
          return 
        } else {
          const decryptedPass = CryptoJS.AES.decrypt(result.rows[0].password, String(process.env.ENC_PASS)).toString(CryptoJS.enc.Utf8);
          if (decryptedPass == login.password) {
            resolve(result.rows[0].id)
            return
          } else {
            reject('invalid password')
            return
          }
          
        }
      }
      );
    });
  }
  public async ResetPassword(id: number, newPassword: string) {
    const password = CryptoJS.AES.encrypt(newPassword, String(process.env.ENC_PASS)).toString();
    this.sqlQuery = "UPDATE users  SET password = $1 WHERE id = $2;";
    return new Promise((resolve, reject) => {db.query(this.sqlQuery, [password, id], (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result.rowCount);
        }
      });
    });
  }

  public async updateUser(user : IUser) {
    this.sqlQuery = "UPDATE users  SET name = $1 , lastname = $2 , email = $3 ,  bio = $4  WHERE id = $5;";
    return new Promise((resolve, reject) => {
      db.query(this.sqlQuery, [user.name.toLocaleLowerCase() , user.lastname.toLocaleLowerCase() , user.email , user.bio , user.id], (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result.rowCount);
        }
      });
    });
  }
  public async getAll(limit: number = 20, page: number = 1) {
    this.sqlQuery ="SELECT id, name , lastname , email , bio ,  to_char(date , 'DD/MM/YYYY') as date FROM USERS LIMIT $1 OFFSET $2";
    const offset: number = (page - 1) * limit;
    const { rowCount } = await db.query("SELECT * FROM users;");
    const laspage = Math.ceil(Number(rowCount) / limit);
    return new Promise((resolve, reject) => {
      db.query(this.sqlQuery, [limit, offset], (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve({
            page,
            limit,
            laspage,
            data: result.rows,
          });
        }
      });
    });
  }

  public async getById(id: number) {
    if (isNaN(id) || !id) {
      return "invalid id";
    }
    this.sqlQuery ="SELECT id , name , lastname , email  , bio ,  to_char(date , 'DD/MM/YYYY') as date FROM USERS WHERE id = $1";
    return new Promise((resolve, reject) => {
      db.query(this.sqlQuery, [id], (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result.rowCount != 0 ? result.rows[0] : "not found");
        }
      });
    });
  }

  public async getByNameOrLastname(search: string,limit: number = 20,page: number = 1) {
    if (!search || search.length == 0) {
      return "invalid search";
    }
    const offset: number = (page - 1) * limit;
    const { rowCount } = await db.query(`SELECT * FROM users WHERE name LIKE '%${search}%' or lastname LIKE '%${search}%';`);
    const laspage = Math.ceil(Number(rowCount) / limit);
    this.sqlQuery = `SELECT id ,name , lastname , email  , bio , to_char(date , 'DD/MM/YYYY') as date  FROM users WHERE name LIKE '%${search.toLocaleLowerCase()}%' or lastname LIKE '%${search.toLocaleLowerCase()}%' LIMIT $1 OFFSET $2;`;
    return new Promise((resolve, reject) => {
      db.query(this.sqlQuery, [limit, offset], (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve({ data: result.rows, laspage, page, limit });
        }
      });
    });
  }

  public async deletebyId(id: number) {
    if (isNaN(id) || !id) {
      return "invalid id";
    }
    return new Promise((resolve, reject) => {
      this.sqlQuery = "DELETE FROM USERS WHERE id = $1;";
      db.query(this.sqlQuery, [id], (err, result) => {
        if (err) {
          reject(err.message);
          return;
        } else {
          resolve("deleted");
          return;
        }
      });
    });
  }
}
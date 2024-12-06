import db from "../database/dbConection";
import IUser from "../@types/User.type";
import dotenv from 'dotenv'
import CryptoJS from "crypto-js";

dotenv.config()

export default class UserModel {
  private sqlQuery: string = "";

  public async create(user: IUser) {
    const password = CryptoJS.AES.encrypt(user.password,String(process.env.ENC_PASS)).toString();
    this.sqlQuery ="INSERT INTO users(name , lastname , email , password) VALUES($1 , $2 , $3 , $4)";
    return new Promise((resolve, reject) => {
      db.query(
        this.sqlQuery,
        [
          user.name.toLowerCase(),
          user.lastname.toLocaleLowerCase(),
          user.email.toLocaleLowerCase(),
          password,
        ],
        (err, result) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(true);
          }
        }
      );
    });
  }
  public async ResetPassword(id : number , newPassword : string) {
    const password = CryptoJS.AES.encrypt(newPassword,String(process.env.ENC_PASS)).toString();
    this.sqlQuery ="UPDATE users  SET password = $1 WHERE id = $2 LIMIT 1;";
    return new Promise((resolve, reject) => {
      db.query(this.sqlQuery,[password, id],(err, result) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(true);
          }
        }
      );
    });
  }
  public async getAll(limit: number = 20, page: number = 1) {
    this.sqlQuery =
      "SELECT name , lastname , email , bio , followers, following , posts , facebookurl , intagramurl , to_char(date , 'DD/MM/YYYY') as date FROM USERS LIMIT $1 OFFSET $2";
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
    this.sqlQuery =
      "SELECT name , lastname , email  , bio , followers, following , posts , facebookurl , intagramurl , to_char(date , 'DD/MM/YYYY') as date FROM USERS WHERE id = $1";
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

  public async getByNameOrLastname(search: string) {
    if (!search || search.length == 0) {
      return "invalid search";
    }
    this.sqlQuery = `select * from users where name like '%${search}%' or lastname like '%${search}%';`;
    return new Promise((resolve, reject) => {
      db.query(this.sqlQuery, (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result.rowCount != 0 ? result.rows : "not found");
        }
      });
    });
  }

  public async deletebyId(id: number) {
    if (isNaN(id) || !id) {
      return "invalid id";
    }
    this.sqlQuery = "DELETE FROM USERS WHERE id = $1";
    await db.query(this.sqlQuery, [id], (err, result) => {
      if (err) {
        return err.message;
      }
      return {
        data: result.rows,
      };
    });
  }
}
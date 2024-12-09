import db from "../database/dbConection";
import IComment from "../@types/Comment.type";

export default class CommentModel {
  private sqlQuery: string = "";
  public async create(comment: IComment): Promise<boolean> {
    this.sqlQuery = "INSERT INTO comment( userid , postid , text) VALUES ($1 , $2 , $3)";
    return new Promise((resolve, reject) => {
      db.query(
        this.sqlQuery,
        [comment.userid, comment.postid, comment.text],
        (err, result) => {
          if (err) {
            reject("user not found");
            return false;
          } else {
            resolve(true);
            return true;
          }
        }
      );
    });
  }

  public async update(id: number, text: string): Promise<boolean | string> {
    this.sqlQuery = "UPDATE comment SET text = $1 WHERE id = $2;";
    return new Promise((resolve, reject) => {
      db.query(this.sqlQuery, [text, id], (err, result) => {
        if (err) {
          reject(false);
          return;
        } else {
          resolve(true);
          return;
        }
      });
    });
  }

  public async getAll(limit: number = 20, page: number = 1, postid: number) {
    this.sqlQuery = `SELECT comment.id as commentid , to_char(comment.date , 'DD/MM/YYYY') as commentdate , comment.text as text , comment.id as commentid  , users.id as userid ,users.name as username , users.lastname as userlastname , users.email as useremail from comment join users on comment.userid = users.id  WHERE comment.postid = $1  LIMIT $2 OFFSET $3`;

    const offset: number = (page - 1) * limit;
    const { rowCount } = await db.query("SELECT id from comment WHERE comment.postid = $1" , [postid]);
    const laspage = Math.ceil(Number(rowCount) / limit);
    return new Promise((resolve, reject) => {
      db.query(this.sqlQuery, [postid, limit, offset], (err, result) => {
        if (err) {
          reject(err.message);
          return
        } else {
          resolve({ page, limit, laspage, data: result.rows });
          return
        }
      });
    });
  }

  public async deleteById(id: number) {
    this.sqlQuery = "DELETE FROM comment WHERE id = $1;";
    return new Promise((resolve, reject) => {
      db.query(this.sqlQuery, [id], (err, result) => {
        if (err) {
          reject(err.message);
          return
        } else {
          resolve(result.rowCount != 0 ? "deleted" : "not found");
          return
        }
      });
    });
  }
}

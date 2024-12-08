import db from "../database/dbConection";
import ILike from "../@types/Like.type";

export default class LikeModel {
  private sqlQuery: string = "";
  public async like(like: ILike): Promise<boolean> {
      this.sqlQuery = "INSERT INTO likes( postid , userid ) VALUES ($1 , $2);";
      return new Promise((resolve, reject) => {
         db.query(this.sqlQuery, [like.postid, like.userid], (err, result) => {
           if (err) {
             reject(false);
             return
           } else {
             resolve(true);
             return
           }
         });
      });
    }

  public async deslike(like : ILike) : Promise<boolean |string>{
    this.sqlQuery = "DELETE FROM likes WHERE postid = $1 AND userid  = $2;";
     return new Promise((resolve, reject) => {
       db.query(this.sqlQuery, [like.postid, like.userid], (err, result) => {
         if (err) {
           reject(err.message);
         } else {
           resolve(true);
         }
       });
     });
  }
    
}
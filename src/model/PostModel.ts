import db from "../database/dbConection";
import IPOst from "../@types/Post.type";

export default class PostModel {
  private sqlQuery: string = "";
  private backgroundColors = [
    "linear-gradient(to right, #cb356b, #bd3f32)",
    "linear-gradient(to right, #3c3b3f, #605c3c)",
    "linear-gradient(to right, #00b09b, #96c93d);",
  ];
  public async create(post: IPOst): Promise<boolean> {
    this.sqlQuery = "INSERT INTO post( userid , image_url , title , text , bg ) VALUES ($1 , $2 , $3 , $4 , $5)";
      return new Promise((resolve, reject) => {
        const randomIndex = Math.floor(Math.random() * this.backgroundColors.length)
      db.query(this.sqlQuery,[post.userid, post.image_url, post.title.toLocaleLowerCase(), post.text.toLocaleLowerCase(), this.backgroundColors[randomIndex] ],(err, result) => {
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

  public async update(post: IPOst): Promise<boolean | string> {
    this.sqlQuery = "UPDATE post SET image_url = $1, title = $2 , text = $3 , bg = $4 WHERE id = $5;";
    return new Promise((resolve, reject) => {
    const randomIndex = Math.floor(Math.random() * this.backgroundColors.length)
      db.query(this.sqlQuery,[post.image_url, post.title.toLocaleLowerCase(), post.text.toLocaleLowerCase(), this.backgroundColors[randomIndex] , post.postid],(err, result) => {
          if (err) {
            reject("user not found");
            return false;
          } else {
            resolve(result.rowCount != 0 ? 'updated' : 'not found');
            return true;
          }
        }
      );
    });
}
    
public async getAll(limit: number = 20, page: number = 1 , userid : number) {
  this.sqlQuery =
  `select post.id as postId , post.title as postTitle , post.text as postText , post.bg as postBG, post.image_url as postImage ,
    to_char(post.date , 'DD/MM/YYYY') as postDate, count(likes.id) as likes, count(comment.id) as comment  ,
    EXISTS (SELECT 1 FROM likes WHERE likes.postid = post.id AND likes.userid = $1) AS is_liked, users.name as username ,
    users.lastname as userlastname ,users.id as userid, users.email as useremail from post
left join likes on post.id = likes.postid  left join users on post.userid = users.id  left join comment on comment.postid = post.id group  by post.id , users.name , users.lastname , users.id, users.email LIMIT $2 OFFSET $3;`;
    
    const offset: number = (page - 1) * limit;
    const { rowCount } = await db.query("SELECT * FROM post;");
    const laspage = Math.ceil(Number(rowCount) / limit);
     return new Promise((resolve, reject) => {
       db.query(this.sqlQuery, [ userid , limit, offset], (err, result) => {
         if (err) {
           console.log(err.message)
           reject(err.message);
         } else {
           resolve({page,limit,laspage,data: result.rows,});
         }
       });
     });
    }
    
public async getById(id:number , userid : number) {
  this.sqlQuery = `select  post.id as postId , post.title as postTitle , post.text as postText , post.bg as postBG, post.image_url as postImage , 
    to_char(post.date , 'DD/MM/YYYY') as postDate, count(likes.id) as likes , count(comment.id) as comment  , EXISTS (SELECT 1 FROM likes WHERE likes.postid = post.id AND likes.userid = $1) AS is_liked, users.name as username , users.lastname as userlastname , users.email as useremail  , users.id as userid from post
left join likes on post.id = likes.postid  left join users on post.userid = users.id   left join comment on comment.postid = post.id WHERE post.id = $2 group  by post.id , users.name , users.lastname , users.email  , users.id`;
     return new Promise((resolve, reject) => {
       db.query(this.sqlQuery, [userid , id], (err, result) => {
         if (err) {
           reject(err.message);
         } else {
           resolve({data: result.rows[0],});
         }
       });
     });
    }
    

public async getByTitleOrText(search: string,limit: number = 20,page: number = 1) {
    if (!search || search.length == 0) {
      return "invalid search";
    }
    const offset: number = (page - 1) * limit;
    const { rowCount } = await db.query(`SELECT * FROM post WHERE title LIKE '%${search}%' or text LIKE '%${search}%';`);
    const laspage = Math.ceil(Number(rowCount) / limit);
    this.sqlQuery = `SELECT * FROM post WHERE title LIKE '%${search.toLocaleLowerCase()}%' or text LIKE '%${search.toLocaleLowerCase()}%' LIMIT $1 OFFSET $2;`;
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

public async deleteById(id:number) {
    this.sqlQuery ="DELETE FROM post WHERE id = $1;";
     return new Promise((resolve, reject) => {
       db.query(this.sqlQuery, [id], (err, result) => {
         if (err) {
           reject(err.message);
         } else {
           resolve(result.rowCount != 0 ? 'deleted' : 'not found');
         }
       });
     });
  }
}
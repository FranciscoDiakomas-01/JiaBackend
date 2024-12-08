import { Request , Response } from "express";
import CommentModel from "../model/CommentModel";
import { CanChangeComment, CanComment, CanCreatePost, HasPermitionToModify, IAuthorization, isPostOwner } from "../services/Validations";
import IComment from "../@types/Comment.type";
import { getIdIndToken } from "../middlewares/jwt";
const commentModel = new CommentModel();

const CommentController = {
  create: async function (req: Request, res: Response) {
    try {
      if (!req.body.postid || isNaN(req.body.postid) || req.body.text?.length == 0 ||  req.body.text?.length > 200) {
          res.status(400).json({
            eror: "invalid postid or text",
          });
          return;
        }
      const comment: IComment = req.body
      const id = Number(getIdIndToken(String(req.headers['authorization']))) 
      comment.userid = id
      const can = await CanComment(comment);
      if (can) {
        commentModel.create(comment).then(() => {
          res.status(201).json({
            data : 'created'
          })
          return
        }).catch(err => {
          res.status(400).json({
            error : err
          })
          return 
        })
      } else {
         res.status(400).json({
           error: "postid or userid doens´t exist",
         });
        return
      }
    } catch (error) {
      res.status(400).json({
        error: "invalid body",
      });
    }
  },
  update: async function (req: Request, res: Response) {
      try {
          if (!req.body?.commentid || isNaN(req.body?.commentid) || req.body?.text?.length == 0 ) {
            res.status(400).json({
              eror: "invalid commentid or text",
            });
            return;
          }
      
        const userId = Number(getIdIndToken(String(req.headers["authorization"])));
        const can = await CanChangeComment(userId, Number(req.body.commentid));
          if (can) {
            commentModel.update(req.body?.commentid, req.body?.text).then(data => {
                  res.status(201).json({
                    data: data,
                  });
                  return;
            }).catch(err => {
                  res.status(400).json({
                    eror: err
                  });
                  return;
              })
          } else {
              res.status(401).json({
                  err : 'this is`nt your comment'
              })
              return
          }
    } catch (error) {
      res.status(400).json({
        error: "invalid body",
      });
    }
  },
  getAll: async function (req: Request, res: Response) {
    try {
      let limit = Number(req.query.limit);
      let page = Number(req.query.page);
      limit = isNaN(limit) ? 20 : limit;
      page = isNaN(page) ? 1 : page;
      const postid: number = Number(req.params.postid);
      if (isNaN(postid)) {
        res.status(400).json({
          error: "invalid postid",
        });
        return;
      }
      commentModel.getAll(limit, page, postid)
        .then((data) => {
          res.status(201).json({ data });
          return;
        })
        .catch((error) => {
          res.status(404).json({ eror: error });
          return;
        });
    } catch (error) {
      res.status(400).json({
        error: "invalid body",
      });
    }
  },
  deleteById: async function (req: Request, res: Response) {
      try {
          if (!req.params?.commentid || isNaN(Number(req.params?.commentid)) ) {
            res.status(400).json({
              eror: "invalid commentid",
            });
            return;
          }
      
        const userId = Number(getIdIndToken(String(req.headers["authorization"])));
        const can = await CanChangeComment(userId, Number(req.params.commentid));
          if (can) {
            commentModel.deleteById(Number(req.params?.commentid)).then(data => {
                  res.status(201).json({
                    data: data,
                  });
                  return;
            }).catch(err => {
                  res.status(400).json({
                    eror: err
                  });
                  return;
              })
          } else {
              res.status(401).json({
                  err : 'this is`nt your comment'
              })
              return
          }
    } catch (error) {
      res.status(400).json({
        error: "invalid body",
      });
    }
  },
};

export default CommentController
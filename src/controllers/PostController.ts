import { Request , Response } from "express";
import PostModel from "../model/PostModel";
import { CanCreatePost, HasPermitionToModify, IAuthorization, isPostOwner } from "../services/Validations";
const post = new PostModel()

const PostController = {
  create: async function (req: Request, res: Response) {
    try {
      if (CanCreatePost(req.body)) {
        post.create(req.body).then((data) => {
            res.status(201).json({
              data: "created",
            });
            return;
          }).catch((error) => {
            res.status(404).json({
              eror: error,
            });
            return;
          });
      } else {
        res.status(400).json({
          eror: "invalid body or image url",
        });
        return;
      }
    } catch (error) {
      res.status(400).json({
        error: "invalid body",
      });
    }
  },
  update: async function (req: Request, res: Response) {
      try {
          if (!req.body.postid || isNaN(req.body.postid) || !req.body.userid || isNaN(req.body.userid)) {
               res.status(400).json({
                 eror: "invalid postid or userid",
               });
               return;
          }
          const isOwner = await isPostOwner(Number(req.body.postid), Number(req.body.userid));
          if (isOwner) {
                 if (CanCreatePost(req.body)) {
                   post.update(req.body).then(() => {
                       res.status(201).json({
                         data: "updated",
                       });
                       return;
                     }).catch((error) => {
                       res.status(404).json({
                         eror: error,
                       });
                       return;
                     });
                 } else {
                   res.status(400).json({
                     eror: "invalid body or image url",
                   });
                   return;
                 }
          } else {
              res.status(401).json({
                  err : 'this is`nt your post'
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
      const userid: number = Number(req.params.userid);
      if (isNaN(userid)) {
        res.status(400).json({
          error: "invalid userid",
        });
        return;
      }
      post
        .getAll(limit, page, userid)
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
  getById: async function (req: Request, res: Response) {
    try {
      const id: number = Number(req.params.id);
      const userid: number = Number(req.params.userid);
      if (isNaN(id) || isNaN(userid)) {
        res.status(400).json({
          error: "invalid postid or userid",
        });
        return;
      }
      post.getById(id , userid)
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
        error: "invalid id",
      });
    }
  },
  getByTitleOrText: async function (req: Request, res: Response) {
    let search = String(req.params.search);
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    limit = isNaN(limit) ? 20 : limit;
    page = isNaN(page) ? 1 : page;
    if (!search) {
      res.status(400).json({
        err: "invalid search",
      });
      return;
    }
    post
      .getByTitleOrText(search, limit, page)
      .then((data) => {
        res.status(200).json({
          data,
        });
      })
      .catch((err) => {
        res.status(400).json({
          err,
        });
      });
    return;
  },
  deleteById: async function (req: Request, res: Response) {
    try {
        if (!req.body.postid || isNaN(req.body.postid) || !req.body.userid || isNaN(req.body.userid)) {
               res.status(400).json({
                 eror: "invalid postid or userid",
               });
               return;
          }
        const isOwner = await isPostOwner(Number(req.body.postid), Number(req.body.userid));
        if (isOwner) {
        post.deleteById(req.body.postid)
          .then((data) => {
            res.status(201).json({ data });
            return;
          })
          .catch((error) => {
            res.status(404).json({ eror: error });
            return;
          });
        }else {
              res.status(401).json({
                  err : 'this is`nt your post'
              })
              return
          }
    } catch (error) {
      res.status(400).json({
        error: "invalid id",
      });
      return;
    }
  },
};

export default PostController
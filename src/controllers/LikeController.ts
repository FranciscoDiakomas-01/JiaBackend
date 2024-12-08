import ILike from "../@types/Like.type";
import LikeModel from '../model/LikeModel'
import { Request , Response } from "express";
import { CanDeslike, CanLike } from "../services/Validations";
const likemodel = new LikeModel()
const LikeController = {

  like: async function (req: Request, res: Response) {
    try {
      const like : ILike = req.body
      const can = await CanLike(like.userid, like.postid)
        if(can){
            likemodel.like(like).then(data => {
              res.status(201).json({
                  data : 'liked'
              })
              return
          }).catch(er => {
              res.status(400).json({
                  error : 'invalid userid or postid'
              })
              return
          })
        } else {
          res.status(400).json({
            error: "you already liked",
          });
          return;
        }
        
    } catch (error) {
        res.status(400).json({
          error: "invalid body",
        });
    }
        
  },
  deslike: async function (req: Request, res: Response) {
     try {
      const like : ILike = req.body
      const can = await CanDeslike(like.userid, like.postid)
        if(can){
            likemodel.deslike(like).then(data => {
              res.status(201).json({
                  data : 'desliked'
              })
              return
          }).catch(er => {
              res.status(400).json({
                  error : 'invalid userid or postid'
              })
              return
          })
        } else {
          res.status(400).json({
            error: "you can´t desliked",
          });
          return;
        }
        
    } catch (error) {
        res.status(400).json({
          error: "invalid body",
        });
    }
  },
};

export default LikeController
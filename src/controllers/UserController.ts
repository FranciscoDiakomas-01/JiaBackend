import { Request, Response } from 'express'
import { CanCreateUser, CanUpdateUser, HasPermitionToModify , IAuthorization, isOwnerAcount } from '../services/Validations'
import UserModel from '../model/UserModel'
import { geretateToken, IPayLoad } from '../middlewares/jwt';
import CryptoJS from 'crypto-js';
const userModel = new UserModel();
import validator from 'validator'
export interface ILogin {
  email: string,
  password : string
}
const UserController = {

  login : async function (req : Request , res : Response) {
    try {
      const login: ILogin = req.body 
      if (!req.body.email || !req.body.password) {
        res.status(400).json({
          error : 'missing email or password'
        })
        return
      } else {
        userModel.login(login).then(data => {

          const token = CryptoJS.AES.encrypt(geretateToken(data as IPayLoad) , String(process.env.ENC_TOKEN)).toString()      
          res.status(200).json({
            data: "sucess",
            token,
            id: data,
          });
          return
        }).catch(err => {
          res.status(401).json({
            error : err
          })
          return
        })
      }
      
    } catch (error) {
      res.status(400).json({
        error : 'invalid body'
      })
      return
    }
  } ,
  create: async function (req: Request, res: Response) {
    try {
      if (CanCreateUser(req.body)) {
        userModel.create(req.body)
          .then((data) => {
            const token = CryptoJS.AES.encrypt(geretateToken(data as IPayLoad), String(process.env.ENC_TOKEN)).toString();
            res.status(201).json({
              data: "created",
              token,
              id : data
            });
            return
          })
          .catch((err) => {
            console.log(err)
            res.status(400).json({
              error: "email already exist",
            });
            return
          });
      } else {
        res.status(400).json({
          error: "invalid user",
        });
        return;
      }
    } catch (error) {
      res.status(400).json({
        error: "empty body",
      });
      return;
    }
  },
  getAll: async function (req: Request, res: Response) {
    let limit = Number(req.query.limit);
    let page = Number(req.query.page);
    limit = isNaN(limit) ? 20 : limit;
    page = isNaN(page) ? 1 : page;
    userModel.getAll(limit, page)
      .then((data) => {
        res.status(200).json({
          data,
        });
        return
      })
      .catch((err) => {
        res.status(400).json({
          err,
        });
        return
      });
    return;
  },
  getById: async function (req: Request, res: Response) {
    let id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({
        err: "invalid id",
      });
      return;
    }
    userModel
      .getById(id)
      .then((data) => {
        res.status(200).json({
          data,
        });
        return
      })
      .catch((err) => {
        res.status(400).json({
          err,
        });
        return
      });
    return;
  },
  getByNameOrLastname: async function (req: Request, res: Response) {
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
    userModel
      .getByNameOrLastname(search, limit, page)
      .then((data) => {
        res.status(200).json({
          data,
        });
        return
      })
      .catch((err) => {
        res.status(400).json({
          err,
        });
        return
      });
    return;
  },
  resetPassword: async function (req: Request, res: Response) {
    try {
      //caso esteje vermelho é o typescript nada esta errado kkkk !
      const userId = req.user;
      //veficar as senhas
      const { email, password, newPassword } = req.body;
      if (!validator.isEmail(email) || password?.length < 8 || newPassword?.length < 8) {
        res.status(400).json({
          error: "invalid body",
        });
        return
      }
      const isOwner = await isOwnerAcount(userId, password, email);
      if (isOwner) {
          userModel.ResetPassword(userId, newPassword)
            .then(() => {
              res.status(200).json({
                data: "updated",
              });
              return;
            })
            .catch((err) => {
              res.status(400).json({
                error: err,
              });
              return;
            });
      } else {
          res.status(401).json({
            error: "ins´nt your acount",
          });
          return;
      }
    
      return;
    } catch (error) {
      res.status(400).json({
        error: "invalid body",
      });
      return
    }
  },
  deleteById: async function (req: Request, res: Response) {
    try {
      //caso esteje vermelho é o typescript nada esta errado kkkk !
      const userId = req.user;
      //veficar as senhas
      const { email, password } = req.body
      const isOwner = await isOwnerAcount(userId, password, email)
      if (isOwner) {
        userModel.deletebyId(userId).then(() => {
              res.clearCookie('token')
              res.status(200).json({
                data: "deleted",
              });
            })
            .catch((err) => {
              res.status(400).json({
                error: err,
              });
            });
          return
      } else {
        res.status(401).json({
          error : 'ins´nt your acount'
        })
        return
      }
    } catch (error) {
      res.status(400).json({
        error: "invalid body",
      });
      return
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      //caso esteje vermelho é o typescript nada esta errado kkkk !
      const userId = req.user;
      console.log(userId)
      //verify Permition
      const { email, password } = req.body;
      const isOwner = await isOwnerAcount(userId, password, email);
      if (isOwner) {
        if (CanUpdateUser(req.body)) {
          req.body.id = userId;
          userModel.updateUser(req.body).then(() => {
              res.status(200).json({
                data: "updated",
              });
              return;
            }).catch((err) => {
              res.status(400).json({
                error: err,
              });
              return;
            });
        } else {
          res.status(400).json({
            error: "invalid body",
          });
          return;
        }
      } else {
        res.status(400).json({
          error: 'this ins´nt your account',
        });
        return;
      }
      return;
    } catch (error) {
      res.status(400).json({
        error: "invalid body",
      });
    }
  },
};

export default  UserController
import { Request, Response } from 'express'
import { CanCreateUser, CanUpdateUser, HasPermitionToModify , IAuthorization } from '../services/Validations'
import UserModel from '../model/UserModel'
import { geretateToken, IPayLoad } from '../middlewares/jwt';
const userModel = new UserModel();
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
          const token = geretateToken(data as IPayLoad)
          res.status(200).json({
            data: 'sucess',
            token
          })
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
    }
  } ,
  create: async function (req: Request, res: Response) {
    try {
      if (CanCreateUser(req.body)) {
        userModel.create(req.body)
          .then(() => {
            res.status(201).json({
              data: "created",
            });
          })
          .catch((err) => {
            res.status(400).json({
              error: "email already exist",
            });
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
      })
      .catch((err) => {
        res.status(400).json({
          err,
        });
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
      })
      .catch((err) => {
        res.status(400).json({
          err,
        });
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
      })
      .catch((err) => {
        res.status(400).json({
          err,
        });
      });
    return;
  },
  resetPassword: async function (req: Request, res: Response) {
    try {
      HasPermitionToModify(req.body)
        .then((data) => {
          const reset: IAuthorization = req.body;
          userModel
            .ResetPassword(reset.id, String(reset.newPassword))
            .then(() => {
              res.status(200).json({
                data: "updated",
              });
            })
            .catch((err) => {
              res.status(400).json({
                error: err,
              });
            });
        })
        .catch((err) => {
          res.status(400).json({
            error: err,
          });
          return;
        });
      return;
    } catch (error) {
      res.status(400).json({
        error: "invalid body",
      });
    }
  },
  deleteById: async function (req: Request, res: Response) {
    try {
      HasPermitionToModify(req.body)
        .then((data) => {
          const reset: IAuthorization = req.body;
          userModel.deletebyId(reset.id).then(() => {
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
        })
        .catch((err) => {
          res.status(400).json({
            error: err,
          });
          return;
        });
      return;
    } catch (error) {
      res.status(400).json({
        error: "invalid body",
      });
      return
    }
  },

  update: async function (req: Request, res: Response) {
    try {
      if (!req.body?.id || isNaN(req.body.id)) {
        res.status(400).json({
          error : 'invalid id'
        })
      }
      
      //verify Permition
      HasPermitionToModify(req.body).then((data) => {
        //validate
          if(CanUpdateUser(req.body)){
            userModel.updateUser(req.body).then(() => {
              res.status(200).json({
                data: "updated",
              });
            }).catch((err) => {
              res.status(400).json({
                error: err,
              });
              return
            });
          } else {
            res.status(400).json({
              error : 'invalid body'
            })
          }
          
      }).catch((err) => {
          res.status(400).json({
            error: err,
          });
          return;
        });
      return;
    } catch (error) {
      res.status(400).json({
        error: "invalid body",
      });
    }
  },
};

export default  UserController
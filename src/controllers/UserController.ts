import { Request, Response } from 'express'
import { CanCreateUser } from '../services/Validations'
import UserModel from '../model/UserModel'
const userModel = new UserModel();

const UserController = {
  create: async function (req: Request, res: Response) {
    try {
      if (CanCreateUser(req.body)) {
        await userModel
          .create(req.body)
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
    userModel
      .getAll(limit, page)
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
    if (!search) {
      res.status(400).json({
        err: "invalid search",
      });
      return;
    }
    userModel
      .getByNameOrLastname(search)
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
      if (CanCreateUser(req.body)) {
        await userModel
          .create(req.body)
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
};

export default  UserController
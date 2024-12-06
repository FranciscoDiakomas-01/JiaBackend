import { Router } from "express";
import UserController from "../controllers/UserController";
const UserRouter = Router();

UserRouter.post("/singin", UserController.create);
UserRouter.post("/resetpassword", UserController.create);
UserRouter.get("/users", UserController.getAll);
UserRouter.get("/user/:id", UserController.getById);
UserRouter.get("/user/filter/:search", UserController.getByNameOrLastname);

export default UserRouter;

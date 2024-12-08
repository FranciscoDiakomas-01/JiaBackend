import { Router } from "express";
import UserController from "../controllers/UserController";
const UserRouter = Router();
import { VerifyToken } from "../middlewares/jwt";
UserRouter.post("/singin", UserController.create);
UserRouter.post("/login", UserController.login);
UserRouter.put("/resetpassword",VerifyToken ,  UserController.resetPassword);
UserRouter.put("/user", VerifyToken , UserController.update);
UserRouter.get("/users", VerifyToken , UserController.getAll);
UserRouter.get("/user/:id", VerifyToken , UserController.getById);
UserRouter.delete("/user", VerifyToken ,UserController.deleteById);
UserRouter.get("/user/filter/:search", VerifyToken , UserController.getByNameOrLastname);

export default UserRouter;

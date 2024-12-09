import { Router } from "express";
import CommentController from "../controllers/CommentController";
import { VerifyToken } from './../middlewares/jwt';
const CommentRoute = Router();
CommentRoute.post("/comment", VerifyToken ,CommentController.create);
CommentRoute.put("/comment/:commentid", VerifyToken, CommentController.update);
CommentRoute.get("/comment/:postid", VerifyToken ,CommentController.getAll);
CommentRoute.delete("/comment/:commentid", VerifyToken ,CommentController.deleteById);
export default CommentRoute;

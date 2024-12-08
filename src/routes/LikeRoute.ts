import { Router } from "express";
import LikeController from "../controllers/LikeController";
const LikeRouter = Router();
import { VerifyToken } from "../middlewares/jwt";
LikeRouter.post("/like", VerifyToken ,LikeController.like);
LikeRouter.delete("/deslike", VerifyToken , LikeController.deslike);
export default LikeRouter;

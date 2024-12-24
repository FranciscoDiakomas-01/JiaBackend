import  express , { Application } from 'express'
import dotenv from 'dotenv'
import { runMigrations } from './database/runMigration'
import UserRouter from './routes/UserRoute';
import PostRoute from './routes/PostRoute';
import LikeRouter from './routes/LikeRoute';
import CommentRoute from './routes/CommentRoute';
import cors from 'cors'
dotenv.config();

async function RunServer() {
    const server: Application = express();
    
    //global middlewares
    server.use(cors());
    server.use(express.json())
    server.use(express.urlencoded({ extended: true }))
    //routes
    server.use(UserRouter)
    server.use(PostRoute);
    server.use(LikeRouter);
    server.use(CommentRoute);

    await runMigrations()

    server.listen(process.env.PORT || 300, () => {
        console.log("Server is running")
    });
}
RunServer()

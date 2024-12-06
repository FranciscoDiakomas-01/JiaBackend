import { UserInfo } from "./Comment.type";
export default interface IAnswer {
  text: string;
  postId: number;
  commentId: number;
  userInfo: UserInfo;
}

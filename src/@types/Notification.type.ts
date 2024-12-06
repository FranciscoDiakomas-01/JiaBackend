import { UserInfo } from "./Comment.type";
enum notificationTypes {
  newPost = 1,
  newComment = 2,
}
export default interface Notification {
  id: number;
  type: notificationTypes;
  postid: number;
  userInfo: UserInfo;
  view: boolean;
}

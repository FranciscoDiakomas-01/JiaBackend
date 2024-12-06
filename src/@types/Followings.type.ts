import { UserInfo } from "./Comment.type";
export default interface IFollowing {
  id: number;
  ownerId: number;
  followerInfo: UserInfo;
}

import { UserInfo } from "./Comment.type";

export default interface IFollower {
  id: number;
  ownerId: number;
  followerInfo: UserInfo;
}

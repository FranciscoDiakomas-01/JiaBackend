import { UserInfo } from "./Comment.type";

export default interface IPOst {
  title: string;
  text: string;
  likes: number;
  comments: number;
  image_url?: string;
  auhtorInfo: UserInfo;
}

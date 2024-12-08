
export default interface IUser {
  id?: number;
  name: string;
  lastname: string;
  password: string;
  email: string;
  bio: string;
  followers: number;
  posts: number;
  followings: number;
  oldPassword?: string;
  newPassword?: string;
}
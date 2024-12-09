
export default interface IUser {
  id?: number;
  name: string;
  lastname: string;
  password: string;
  email: string;
  bio: string;
  newPassword?: string;
}
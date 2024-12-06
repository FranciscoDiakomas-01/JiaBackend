
export default interface IUser {
    name: string,
    lastname: string,
    password: string,
    email: string,
    bio: string,
    followers: number,
    posts: number,
    followings : number
    facebookURL?: string,
    instagramURL? : string
}
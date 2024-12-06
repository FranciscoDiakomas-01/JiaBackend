
export default interface Comment {
    userInfo: UserInfo,
    text: string,
    date: Date,
    postId: number,
    answers : number
}

export interface UserInfo{
    id: number | string,
    name: string,
    lastname: string,
    email: string,
    posts: number,
    followers: number,
    followings : number
}
export enum ActionType {
    ISLOGGEDIN = "isLoggedIn",
    USER_INFO = "userInfo"
}

export interface actionIsLoggedIn {
    type: ActionType.ISLOGGEDIN
    payload: boolean
}

export interface userInfo {
    id: number,
    name: string,
    email: string,
}

export interface actionUserInfo {
    type: ActionType.USER_INFO
    payload: userInfo
}

export type Action = actionIsLoggedIn | actionUserInfo
export type State = {
    isLoggedIn: boolean
    userInfo: any
}
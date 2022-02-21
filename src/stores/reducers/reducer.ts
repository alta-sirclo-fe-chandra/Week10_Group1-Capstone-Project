import { Action, ActionType, State } from "../types/type";

const initialState = {
  isLoggedIn: false,
  userInfo: {}
};

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.ISLOGGEDIN:
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    case ActionType.USER_INFO:
      return {
        ...state,
        userInfo: action.payload,
      };
    default:
      return state;
  }
};

export type RootState = ReturnType<typeof reducer>

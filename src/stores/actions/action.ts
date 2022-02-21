import { userInfo } from "../types/type";

type payload = boolean | userInfo

export function reduxAction (type: string, payload: payload) {
  return { type, payload };
};

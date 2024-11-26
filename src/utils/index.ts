import { IUser } from "../types";

export const getUserTitle = (user: IUser): string => {
  return `${user.last_name} ${user.first_name}, ${user.job}`;
};

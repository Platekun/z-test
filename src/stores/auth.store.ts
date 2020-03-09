import { IUser } from "../types";

const sampleUser: IUser = {
  id: "1",
  name: "John Doe",
  email: "johndoe@email.com"
};

export class AuthStore {
  get user(): IUser {
    return sampleUser;
  }
}

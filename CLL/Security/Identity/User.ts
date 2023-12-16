import { UserType } from "../UserType.const";

export abstract class User {
  public readonly userId: number;
  public readonly name: string;
  public readonly userName: string;
  public readonly userType: UserType;

  constructor(userId: number, userName: string, name: string, userType: UserType) {
    this.userId = userId;
    this.userName = userName;
    this.name = name;
    this.userType = userType;
  }
}

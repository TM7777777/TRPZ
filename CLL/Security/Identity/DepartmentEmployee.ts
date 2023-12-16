import { UserType } from "../UserType.const";
import { User } from "./User";

export class DepartmentEmployee extends User {
  constructor(userId: number, userName: string, name: string) {
    super(userId, userName, name, UserType.DepartmentEmployee);
  }
}

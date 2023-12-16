import { UserType } from "../UserType.const";
import { User } from "./User";

export class NuclearPlantEmployee extends User {
  constructor(userId: number, userName: string, name: string) {
    super(userId, userName, name, UserType.NuclearPlantEmployee);
  }
}

import { User } from "./Identity/User";

export class SecurityContext {
  private static user: User | null = null;

  public static getUser(): User | null {
    return this.user;
  }

  public static setUser(user: User): void {
    this.user = user;
  }
}

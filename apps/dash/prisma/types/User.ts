import { Prisma, User, UserInfo } from "../client";

export type UserWithoutPassword = Omit<User, "password">;

export type UserWithInfo = UserWithoutPassword & { info: UserInfo };

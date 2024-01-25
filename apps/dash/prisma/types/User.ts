import { Prisma, User, UserInfo } from "@prisma/client";

export type UserWithoutPassword = Omit<User, "password">;

export type UserWithInfo = UserWithoutPassword & { info: UserInfo };

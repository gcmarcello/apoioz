"use server";

import * as usersService from "./users.service";

class UsersActions {
  findUser(id: string) {
    return usersService.findUser({ id });
  }
}
export const { findUser } = new UsersActions();

"use server";

import * as usersService from "./users.service";

class UsersActions {
  findUser(data) {
    return usersService.findUser(data);
  }
}
export const { findUser } = new UsersActions();

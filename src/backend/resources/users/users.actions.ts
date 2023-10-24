"use server";

import * as usersService from "./users.service";

export async function findUser(id: string) {
  return usersService.findUser({ id });
}

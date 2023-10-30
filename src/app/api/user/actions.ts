"use server";

import * as usersService from "./service";

export async function findUser(id: string) {
  return usersService.findUser({ id });
}

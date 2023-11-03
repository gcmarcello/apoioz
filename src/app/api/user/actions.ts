"use server";

import * as service from "./service";

export async function getUserFromSupporter(supporterId: string) {
  return service.getUserFromSupporter(supporterId);
}

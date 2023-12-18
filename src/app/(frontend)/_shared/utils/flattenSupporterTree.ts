import { Prisma, Supporter } from "@prisma/client";
import { SupporterWithReferred } from "prisma/types/Supporter";

export function flattenSupporterWithReferred(supporter: SupporterWithReferred) {
  const { referred, ...rest } = supporter;
  return [rest, ...referred];
}

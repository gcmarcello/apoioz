"use server";
import { headers } from "next/headers";
import { MiddlewareArguments } from "./useMiddlewares";

export async function IpMiddleware<R, A>({
  request,
}: MiddlewareArguments<R, A>) {
  const ip = headers().get("X-Forwarded-For")!;
  return {
    request: {
      ...request,
      ip,
    },
  };
}

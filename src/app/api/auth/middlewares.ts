import prisma from "@/tests/client";
import { LoginDto } from "./dto";
import { NextResponse } from "next/server";

export async function ExistingUserMiddleware({ request }: { request: LoginDto }) {
  const isEmail = request.identifier.includes("@");

  const user = await prisma.user.findFirst({
    where: isEmail ? { email: request.identifier } : { name: request.identifier },
  });

  if (!user) throw `Usuário não encontrado`;

  return {
    ...request,
    user,
    isEmail,
  };
}

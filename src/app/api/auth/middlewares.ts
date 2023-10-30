import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";
import prisma from "@/tests/client";
import { LoginDto } from "./dto";

export async function ExistingUserMiddleware({ request }: { request: LoginDto }) {
  const isEmail = request.identifier.includes("@");

  const user = await prisma.user.findFirst({
    where: isEmail ? { email: request.identifier } : { name: request.identifier },
  });

  if (!user)
    throw _NextResponse.rawError({
      message: `Usuário não encontrado`,
      status: 404,
    });

  return {
    ...request,
    user,
    isEmail,
  };
}

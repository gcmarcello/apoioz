import { normalizeEmail, normalizePhone } from "@/_shared/utils/format";
import { LoginDto } from "./dto";
import { MiddlewareArguments } from "@/middleware/functions/useMiddlewares";

export async function ExistingUserMiddleware<R extends LoginDto, A>({
  request,
}: MiddlewareArguments<R, A>) {
  const isEmail = request.identifier.includes("@");

  const user = await prisma.user.findFirst({
    where: isEmail
      ? { email: normalizeEmail(request.identifier) }
      : { phone: normalizePhone(request.identifier) },
  });

  if (!user) throw `Usuário não encontrado`;

  return {
    ...request,
    user,
    isEmail,
  };
}

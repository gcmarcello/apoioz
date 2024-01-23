import { normalizeEmail, normalizePhone } from "@/_shared/utils/format";
import { LoginDto } from "./dto";

export async function ExistingUserMiddleware({
  request,
}: {
  request: LoginDto;
}) {
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

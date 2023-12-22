import { LoginDto } from "./dto";

export async function ExistingUserMiddleware({ request }: { request: LoginDto }) {
  const isEmail = request.identifier.includes("@");

  const user = await prisma.user.findFirst({
    where: isEmail ? { email: request.identifier } : { name: request.identifier },
  });

  console.log(isEmail, user);

  if (!user) throw `Usuário não encontrado`;

  return {
    ...request,
    user,
    isEmail,
  };
}

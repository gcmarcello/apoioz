import { Prisma } from "@prisma/client";

export function handlePrismaError(target: string, error: any) {
  if (!error) throw `${target} não encontrado(a)`;
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;

  switch (error.code) {
    case "P2002":
      throw `Erro ao criar ${target}. ${error.meta && error.meta.target + " já existente."}`;
    default:
      throw `Erro ao processar requisição. ${error}`;
  }
}

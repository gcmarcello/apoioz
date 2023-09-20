import { Prisma } from "@prisma/client";

export function handlePrismaError(target: string, error: any) {
  if (!error) throw { message: `${target} não encontrado(a)`, status: 404 };
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;

  switch (error.code) {
    case "P2002":
      throw { message: `Erro ao criar ${target}. ${error.meta && error.meta.target + " já existente."}`, status: 409 };
    default:
      throw { message: `Erro ao processar requisição. ${error?.meta?.cause}`, status: 400 };
  }
}

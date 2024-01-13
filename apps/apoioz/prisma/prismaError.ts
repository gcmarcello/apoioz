import { toProperCase } from "@/_shared/utils/format";
import { Prisma } from "@prisma/client";

export function handlePrismaError(target: string, error: any) {
  if (!error)
    throw [`${target} não encontrado(a)`, `${target} não encontrado(a)`];
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;

  switch (error.code) {
    case "P2002":
      const field: any = error.meta?.target;
      throw `Erro ao criar ${target}. ${
        toProperCase(field[0] as string) + " já existente."
      }`;
    default:
      throw `Erro ao processar requisição. ${error.message}`;
  }
}

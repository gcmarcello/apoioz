import { Prisma } from "@prisma/client";
import { toProperCase } from "../utils/format";

export function handlePrismaError(target: string, error: any) {
  if (!error) throw { message: `${target} não encontrado(a)`, status: 404 };
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;

  switch (error.code) {
    case "P2002":
      const field: any = error.meta?.target;
      throw {
        message: `Erro ao criar ${target}. ${
          toProperCase(field[0] as string) + " já existente."
        }`,
        status: 409,
      };
    default:
      throw {
        message: `Erro ao processar requisição. ${error.message}`,
        status: 400,
      };
  }
}

import { toProperCase } from "@/(shared)/utils/format";
import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";
import { Prisma } from "@prisma/client";

export function handlePrismaError(target: string, error: any) {
  if (!error) throw [`${target} não encontrado(a)`, `${target} não encontrado(a)`];
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) throw error;

  switch (error.code) {
    case "P2002":
      const field: any = error.meta?.target;
      throw _NextResponse.rawError({
        message: `Erro ao criar ${target}. ${
          toProperCase(field[0] as string) + " já existente."
        }`,
        status: 409,
      });
    default:
      throw _NextResponse.rawError({
        message: `Erro ao processar requisição. ${error.message}`,
        status: 400,
      });
  }
}

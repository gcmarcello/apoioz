import { _NextResponse } from "@/(shared)/utils/http/_NextResponse";
import { MiddlewareArguments } from "../types/types";

export async function ValidatorMiddleware({
  additionalArguments,
  request,
}: MiddlewareArguments) {
  if (!additionalArguments) throw new Error("Missing additionalArguments");

  const { success, error } = await additionalArguments.schema.safeParse(request);

  if (!success) {
    console.error(error);
    return _NextResponse.rawError({
      message: "Erro ao validar os dados.",
      status: 400,
    });
  }
}

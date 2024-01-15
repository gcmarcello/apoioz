import { MiddlewareArguments } from "../types/types";

export async function ValidatorMiddleware({
  additionalArguments,
  request,
}: MiddlewareArguments) {
  if (!additionalArguments) throw new Error("Missing additionalArguments");

  const { success, error } =
    await additionalArguments.schema.safeParse(request);

  if (!success) {
    console.error(error);
    return "Erro ao validar os dados.";
  }
}

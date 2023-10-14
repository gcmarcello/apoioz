import { deleteUser } from "@/backend/resources/users/users.service";
import { ServerExceptionType } from "@/shared/types/serverExceptionTypes";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await deleteUser(id);
    return NextResponse.json({ message: "Apoiador removido com sucesso" });
  } catch (error) {
    return NextResponse.json(error, {
      status: (error as ServerExceptionType).status || 400,
    });
  }
}

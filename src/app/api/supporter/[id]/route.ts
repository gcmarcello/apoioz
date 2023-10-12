import { NextResponse } from "next/server";
import { ServerExceptionType } from "../../../../common/types/serverExceptionTypes";
import { deleteUser } from "../../../../resources/api/services/user";

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

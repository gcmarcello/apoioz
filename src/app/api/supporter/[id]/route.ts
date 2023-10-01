import { NextResponse } from "next/server";
import { ServerExceptionType } from "../../../../common/types/serverExceptionTypes";
import { createUser, deleteUser, updateUser } from "../../../../resources/api/services/user";
import { UserType } from "../../../../common/types/userTypes";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body: UserType = await request.json();
    const updatedUser = await updateUser(body, id);
    return NextResponse.json({ name: updatedUser?.name, email: updatedUser?.email, info: updatedUser?.info });
  } catch (error) {
    return NextResponse.json(error, { status: (error as ServerExceptionType).status || 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await deleteUser(id);
    return NextResponse.json({ message: "Apoiador removido com sucesso" });
  } catch (error) {
    return NextResponse.json(error, { status: (error as ServerExceptionType).status || 400 });
  }
}

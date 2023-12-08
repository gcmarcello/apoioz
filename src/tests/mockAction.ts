import { ActionResponse } from "@/app/api/_shared/utils/ActionResponse";

export async function mockAction(data: any) {
  try {
    return ActionResponse.success({
      data,
    });
  } catch (error) {
    return ActionResponse.error(error);
  }
}

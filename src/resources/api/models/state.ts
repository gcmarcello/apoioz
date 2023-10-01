import { StateType } from "../../../common/types/locationTypes";
import prisma from "../../../common/utils/prisma";

export async function findState({ stateId }: { stateId: string }) {
  return await prisma.state.findUnique({ where: { id: stateId } });
}

export async function listStates({ stateIds }: { stateIds: string[] }) {
  return await prisma.state.findMany({ where: { id: { in: stateIds } } });
}

export async function deleteState({ stateId }: { stateId: string }) {
  return await prisma.state.delete({ where: { id: stateId } });
}

export async function updateStates({ stateId, stateData }: { stateId: string; stateData: StateType }) {
  return await prisma.state.update({ where: { id: stateId }, data: stateData });
}

export async function createState({ stateData }: { stateData: StateType }) {
  return await prisma.state.create({ data: stateData });
}

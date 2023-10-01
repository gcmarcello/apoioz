import { AddressType } from "../../../common/types/locationTypes";
import prisma from "../../../common/utils/prisma";

export async function findAddress({ addressId }: { addressId: string }) {
  return await prisma.address.findUnique({ where: { id: addressId } });
}

export async function listAddresses({ addressIds }: { addressIds: string[] }) {
  return await prisma.address.findMany({ where: { id: { in: addressIds } } });
}

export async function deleteAddress({ addressId }: { addressId: string }) {
  return await prisma.address.delete({ where: { id: addressId } });
}

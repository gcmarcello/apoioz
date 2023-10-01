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

export async function updateAddresses({ addressId, addressData }: { addressId: string; addressData: AddressType }) {
  return await prisma.address.update({ where: { id: addressId }, data: addressData });
}

export async function createAddress({ addressData }: { addressData: AddressType }) {
  return await prisma.address.create({ data: addressData });
}

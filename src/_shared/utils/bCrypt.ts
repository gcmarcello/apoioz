import bcrypt from "bcrypt";

export async function hashInfo(info: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(info, saltRounds);
}

export async function compareHash(info: string, referenceHash: string): Promise<boolean> {
  return await bcrypt.compare(info, referenceHash);
}

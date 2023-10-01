export function normalize(data: string) {
  return data.toLowerCase();
}

export function normalizePhone(data: string) {
  return data.replace(/[^0-9]/g, "");
}

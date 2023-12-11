import { normalizePhone } from "../format";

export function phoneValidator(data: string) {
  const normalizedPhone = normalizePhone(data);
  const phoneRegex = /^\d{10,}$/;
  return phoneRegex.test(normalizedPhone);
}

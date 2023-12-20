export function normalizeEmail(data: string) {
  return data.toLowerCase();
}

export function normalizePhone(data: string) {
  return data?.replace(/[^0-9]/g, "");
}

export function formatPhone(data: string) {
  const DDD = data.split("").slice(0, 2).join("");
  const firstPart = data.slice(2, 7);
  const secondPart = data.slice(7);
  return `(${DDD}) ${firstPart}-${secondPart}`;
}

export function toProperCase(input: string): string | undefined {
  if (!input) return;
  return input
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export function maskEmail(email: string) {
  let [username, domain] = email.split("@");
  let [domainName, domainExtension] = domain.split(".");

  let maskedUsername = username.slice(0, 3) + "*".repeat(username.length - 3);

  let maskedDomainName = domainName.slice(0, 3) + "*".repeat(domainName.length - 3);

  return `${maskedUsername}@${maskedDomainName}.${domainExtension}`;
}

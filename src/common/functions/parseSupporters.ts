import dayjs from "dayjs";

export function parseSupporters(data: any) {
  const supporters = data.map((supporter: any) => ({
    name: supporter.user?.name,
    referral: supporter.referral?.user.name,
    zone: supporter.user?.info?.Zone?.number,
    section: supporter.user?.info?.Section?.number,
    assignedAt: dayjs(supporter.assignedAt).format("DD/MM/YYYY"),
  }));

  return supporters;
}

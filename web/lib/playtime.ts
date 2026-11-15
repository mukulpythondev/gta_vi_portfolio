const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
/**
 * "Sep 2024 – Mar 2025" -> "7 mo". Present counts to the build date. Shared by
 * the experience page, the home career road and the experience detail pages.
 */
export function playtime(duration: string) {
  const [from, to] = duration.split(/\s+[–-]\s+/);
  const month = (text: string) => {
    if (/present/i.test(text)) {
      const now = new Date();
      return now.getFullYear() * 12 + now.getMonth();
    }
    const [m, y] = text.trim().split(" ");
    return Number(y) * 12 + MONTHS.indexOf(m);
  };
  const months = month(to ?? from) - month(from) + 1;
  if (months < 12) return `${months} mo`;
  return months % 12
    ? `${Math.floor(months / 12)} yr ${months % 12} mo`
    : `${months / 12} yr`;
}

/** Total months across all jobs. */
export function monthsOf(duration: string) {
  const [from, to] = duration.split(/\s+[–-]\s+/);
  const month = (text: string) => {
    if (/present/i.test(text)) {
      const now = new Date();
      return now.getFullYear() * 12 + now.getMonth();
    }
    const [m, y] = text.trim().split(" ");
    return Number(y) * 12 + MONTHS.indexOf(m);
  };
  return month(to ?? from) - month(from) + 1;
}

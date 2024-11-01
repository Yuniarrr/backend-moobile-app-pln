export function getTime(wib: number = 7) {
  const now = new Date();
  const utc = now.getTime();
  const nd = new Date(utc + 3_600_000 * wib);

  return nd.toISOString();
}

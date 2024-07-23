export function getTime() {
  const now = new Date();
  const utc = now.getTime();
  const nd = new Date(utc + 3_600_000 * 7);

  return nd.toISOString();
}

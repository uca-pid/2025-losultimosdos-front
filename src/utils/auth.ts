export function getUserIdFromToken(token: string): number | null {
  try {
    const [, payload] = token.split('.');
    const json = JSON.parse(atob(payload));
    return typeof json.userId === 'number' ? json.userId : Number(json.userId) || null;
  } catch {
    return null;
  }
}
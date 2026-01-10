export function serializeScopes(scopes: string[]): string {
  const q = new URLSearchParams();

  scopes.forEach((scope) => q.set('scopes[]', scope));

  return q.toString();
}

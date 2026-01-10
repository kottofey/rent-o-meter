export function serializeQuery({
  includes,
  scopes,
}: {
  includes?: string[];
  scopes?: unknown;
}): string {
  const q = new URLSearchParams();

  includes?.forEach((include) => q.append('includes[]', include));

  if (Array.isArray(scopes)) {
    // -----------------------------------------------------------------------------
    // Обычный массив
    // -----------------------------------------------------------------------------

    scopes?.forEach((scope) => q.append('scopes[]', scope));
  } else if (scopes && typeof scopes === 'object') {
    // -----------------------------------------------------------------------------
    // Объект, простой или с вложенными объектами
    // -----------------------------------------------------------------------------

    Object.entries(scopes).forEach(([key, value]) => {
      if (value == null) return;

      if (typeof value !== 'object') {
        q.append(`scopes[${key}]`, String(value));
      } else {
        // Рекурсивно обрабатываем вложенные объекты
        Object.entries(value).forEach(([child_key, child_value]) => {
          if (child_value != null) {
            q.append(`scopes[${key}][${child_key}]`, String(child_value));
          }
        });
      }
    });
  }

  return q.toString();
}

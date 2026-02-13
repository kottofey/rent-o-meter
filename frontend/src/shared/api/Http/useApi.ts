import { CustomError } from './error';

export default async function useApi<T>({
  route,
  query,
  method,
  body,
}: {
  route: string;
  query?: string;
  method?: string;
  body?: string;
}) {
  const { VITE_API_BASE_URL, VITE_API_PORT, MODE } = import.meta.env;

  const parsedQuery = query ? '?' + query : '';

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const resp = await fetch(
    MODE === 'development'
      ? `/api/v1/${route}${parsedQuery}`
      : `${VITE_API_BASE_URL}:${VITE_API_PORT}/api/v1/${route}${parsedQuery}`,
    {
      mode: 'cors',
      method,
      body,
      headers,
    },
  );

  if (!resp.ok) {
    const err_response = await resp
      .json()
      .catch(() => ({ json: 'not a json in a response' }));

    throw new CustomError({
      status: resp.status,
      message:
        typeof err_response === 'object' && err_response.message
          ? err_response.message
          : `Ошибка ${resp.status}`,
      parentError: err_response,
    });
    // return { status: resp.status };
  }

  return (await resp.json()) as T;
}

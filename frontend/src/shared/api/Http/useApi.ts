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
  const { VITE_API_BASE_URL, VITE_API_PORT } = import.meta.env;

  const parsedQuery = query ? '?' + query : '';

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const resp = await fetch(
    `${VITE_API_BASE_URL}:${VITE_API_PORT}/api/v1/${route}${parsedQuery}`,
    {
      mode: 'cors',
      method,
      body,
      headers,
    },
  );

  if (!resp.ok) {
    const err_response = await resp.json();

    throw new CustomError({
      status: resp.status,
      message: JSON.stringify(err_response),
    });
    // return { status: resp.status };
  }

  return (await resp.json()) as T;
}

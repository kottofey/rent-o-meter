import { Request, Response, NextFunction } from 'express';

/**
 * Принудительно добавляет скоуп byRentee для не-админов.
 * @param resource - имя ресурса (например 'agreements', 'counters')
 * @param renteeField - поле в scopes, например 'byRentee'
 */
export default function enforceRenteeScopeMiddleware(resource: string, renteeField = 'byRentee') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (user && !user.roles.includes('admin') && user.renteeId) {
      const scopes = { ...(req.query.scopes as Record<string, unknown> | undefined) };
      scopes[`${resource}:${renteeField}`] = user.renteeId;

      Object.defineProperty(req, 'query', {
        value: { ...req.query, scopes },
      });
    }

    next();
  };
}

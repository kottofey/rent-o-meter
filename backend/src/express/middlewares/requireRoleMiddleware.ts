import { Request, Response, NextFunction } from 'express';
import { Role } from '@/models';

export default function requireRoleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // const { userRoles }: { userRoles: Pick<Role, 'name'>[] } = req.body;

  // console.log(req);
  // if (!userRoles || userRoles.length === 0) {
  //   res.status(403).json({
  //     success: false,
  //     message: 'Недостаточно прав',
  //   });
  //   return;
  // }
  //
  // const hasRole = userRoles.some(role => roles.includes(role.name));
  //
  // if (!hasRole) {
  //   res.status(403).json({
  //     success: false,
  //     message: 'Недостаточно прав',
  //   });
  //   return;
  // }

  next();
}

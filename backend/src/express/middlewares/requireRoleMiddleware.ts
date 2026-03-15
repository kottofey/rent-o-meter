import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { Permission, Role } from '@/models';
import { jwtConfig } from '@/config';
import { type IUserPayload } from '@/helpers';

export default async function requireRoleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const routeName = req.path.replace(/^\/api\/v1\/([^/]+).*$/, '$1');

  const permissionsForRoute = await Permission.findAll({
    where: {
      resource: routeName,
    },
    include: [
      {
        model: Role,
        as: 'roles',
      },
    ],
  });

  const token = req.cookies.token as string;

  const { roles: userRoles } = jwt.verify(token, jwtConfig.secret, {
    ignoreExpiration: true,
  }) as IUserPayload;

  if (userRoles.length === 0) {
    res.status(403).json({
      success: false,
      message: 'Недостаточно прав 1',
    });
    return;
  }

  const rolesForRoute = new Set();
  permissionsForRoute
    .map(perm => perm.roles)
    .map(roles => roles.map(role => role.name))
    .flat(Infinity)
    .forEach(role => {
      rolesForRoute.add(role);
    });

  const hasRole = userRoles.some(role => rolesForRoute.has(role));

  if (!hasRole) {
    res.status(403).json({
      success: false,
      message: 'Недостаточно прав 2',
    });
    return;
  }

  next();
}

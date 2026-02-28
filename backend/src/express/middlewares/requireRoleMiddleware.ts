import { Request, Response, NextFunction } from 'express';
import { Permission, Role } from '@/models';
import chalk from 'chalk';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtConfig } from '@/config';
import { type IUserPayload, getActionFromRoute } from '@/helpers';

export default async function requireRoleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const routeName = req.path.replace(/^\/api\/v1\/([^\/]+).*$/, '$1');

  const permissionsForRoute = await Permission.findAll({
    where: {
      resource: routeName,
    },
    include: Role,
  });

  const token = req.cookies.token as string;
  const { roles: userRoles } = jwt.verify(token, jwtConfig.secret as string, {
    ignoreExpiration: true,
  }) as IUserPayload;

  if (!userRoles || userRoles.length === 0) {
    res.status(403).json({
      success: false,
      message: 'Недостаточно прав 1',
    });
    return;
  }

  const rolesForRoute = new Set();
  permissionsForRoute
    .map(perm => perm.toJSON().roles as Role[])
    .map(roles => roles.map(role => role.name))
    .flat(Infinity)
    .forEach(role => {
      // console.log('role add', role);
      rolesForRoute.add(role);
    });

  const hasRole = userRoles.some(role => rolesForRoute.has(role));
  // console.log('userRoles', userRoles);
  // console.log('rolesForRoute', rolesForRoute);
  // console.log('hasRole', hasRole);

  if (!hasRole) {
    res.status(403).json({
      success: false,
      message: 'Недостаточно прав 2',
    });
    return;
  }

  next();
}

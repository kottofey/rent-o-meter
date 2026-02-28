import { NextFunction } from 'express';

export default function requirePermissionMiddleware(resource: string, action: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    next();
  };
}

// const requirePermission = (resource, action) => {
//   return (req, res, next) => {
//     if (!req.userPermissions || req.userPermissions.length === 0) {
//       return res.status(403).json({
//         success: false,
//         message: 'Недостаточно прав'
//       });
//     }
//
//     const hasPermission = req.userPermissions.some(permission =>
//       permission.resource === resource && permission.action === action
//     );
//
//     if (!hasPermission) {
//       return res.status(403).json({
//         success: false,
//         message: 'Недостаточно прав'
//       });
//     }
//
//     next();
//   };
// };

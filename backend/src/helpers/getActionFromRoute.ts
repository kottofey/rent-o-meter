import { Request } from 'express';
import chalk from 'chalk';

export default function getActionFromRoute(req: Request) {
  /**
   * Выделяем две группы, первая - русурс, вторая опциональная является ли действием 'restore'
   */
  const reg = /^\/api\/v1\/([^/]+)(?:\/\d+)?(?:\/(\w+))?$/;

  const ACTIONS_METHODS: Record<string, string> = {
    POST: 'create',
    GET: 'read',
    PUT: 'update',
    DELETE: 'delete',
  };

  let qAction = null;
  let qResource = null;

  const method = req.method;

  const match = reg.exec(req.path);

  if (match) {
    qResource = match[1];

    qAction = ACTIONS_METHODS[method];

    if (match[2] === 'restore') qAction = 'restore';
  }

  return { action: qAction, resource: qResource };
}

import express, {
  type Request,
  type Response,
  type RequestHandler,
  type NextFunction,
} from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import qs from 'qs';

import {
  agreementsRoute,
  countersRoute,
  renteeRoute,
  tariffsRoute,
  billsRoute,
  authRoute,
  usersRoute,
} from '@/routes';

import { authMiddleware, requireRoleMiddleware } from '@/middlewares';

const app = express();

app.use(cors({ origin: 'https://rent-o-meter.kottofey.ru', credentials: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('query parser', (str: string) => qs.parse(str));

interface IRouteController {
  getById?(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAll?(req: Request, res: Response, next: NextFunction): Promise<void>;
  create?(req: Request, res: Response, next: NextFunction): Promise<void>;
  update?(req: Request, res: Response, next: NextFunction): Promise<void>;
  remove?(req: Request, res: Response, next: NextFunction): Promise<void>;
  restore?(req: Request, res: Response, next: NextFunction): Promise<void>;
}

const routes: { [routeName: string]: IRouteController } = {
  rentees: renteeRoute,
  agreements: agreementsRoute,
  counters: countersRoute,
  tarifs: tariffsRoute,
  bills: billsRoute,
  users: usersRoute,
};

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler: RequestHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

app.get('/api/v1/', (_req: Request, res: Response) => {
  try {
    res.send('Hello API! This is V1');
  } catch (e: unknown) {
    console.error('root route errer:', e);
    res.send(e);
  }
});

// Define the standard REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(routes)) {
  if (routeController.getAll) {
    app.get(
      `/api/v1/${routeName}`,
      authMiddleware,
      requireRoleMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.getAll),
    );
  }

  if (routeController.getById) {
    app.get(
      `/api/v1/${routeName}/:id`,
      authMiddleware,
      requireRoleMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.getById),
    );
  }

  if (routeController.create) {
    app.post(
      `/api/v1/${routeName}`,
      authMiddleware,
      requireRoleMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.create),
    );
  }

  if (routeController.update) {
    app.put(
      `/api/v1/${routeName}/:id`,
      authMiddleware,
      requireRoleMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.update),
    );
  }

  if (routeController.remove) {
    app.delete(
      `/api/v1/${routeName}/:id`,
      authMiddleware,
      requireRoleMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.remove),
    );
  }

  if (routeController.restore) {
    app.put(
      `/api/v1/${routeName}/:id/restore`,
      authMiddleware,
      requireRoleMiddleware,
      makeHandlerAwareOfAsyncErrors(routeController.restore),
    );
  }
}

// -----------------------------------------------------------------------------
// Auth routes
// -----------------------------------------------------------------------------
app.post('/api/v1/auth/register', makeHandlerAwareOfAsyncErrors(authRoute.register));
app.post('/api/v1/auth/login', makeHandlerAwareOfAsyncErrors(authRoute.login));
app.delete('/api/v1/auth/logout', authMiddleware, makeHandlerAwareOfAsyncErrors(authRoute.logout));
// app.post('/api/v1/auth/refresh-token', makeHandlerAwareOfAsyncErrors(authRoute.refreshToken));
app.get('/api/v1/me', authMiddleware, makeHandlerAwareOfAsyncErrors(authRoute.me));

export default app;

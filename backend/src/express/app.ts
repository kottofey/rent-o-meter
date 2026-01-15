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

import { agreementsRoute, countersRoute, renteeRoute, tariffsRoute } from '@/routes';

// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// import { dirname, join } from 'node:path';
// import { fileURLToPath } from 'node:url';
// import fs from 'fs/promises';

// const __dirname = dirname(fileURLToPath(import.meta.url));
// const env = await fs.readFile(join(__dirname, '../../.env'), 'utf8');
// const { JWT_SECRET } = dotenv.parse(env);

const app = express();

app.use(cors({ origin: '*' }));

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
    res.send('Hello Express!');
  } catch (e: unknown) {
    console.error('root route errer:', e);
    res.send(e);
  }
});

// Define the standard REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(routes)) {
  if (routeController.getAll) {
    app.get(`/api/v1/${routeName}`, makeHandlerAwareOfAsyncErrors(routeController.getAll));
  }

  if (routeController.getById) {
    app.get(`/api/v1/${routeName}/:id`, makeHandlerAwareOfAsyncErrors(routeController.getById));
  }

  if (routeController.create) {
    app.post(`/api/v1/${routeName}`, makeHandlerAwareOfAsyncErrors(routeController.create));
  }

  if (routeController.update) {
    app.put(`/api/v1/${routeName}/:id`, makeHandlerAwareOfAsyncErrors(routeController.update));
  }

  if (routeController.remove) {
    app.delete(`/api/v1/${routeName}/:id`, makeHandlerAwareOfAsyncErrors(routeController.remove));
  }

  if (routeController.restore) {
    app.put(
      `/api/v1/${routeName}/:id/restore`,
      makeHandlerAwareOfAsyncErrors(routeController.restore),
    );
  }
}

export default app;

import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wrapper to workaround async errors not being transmitted correctly.
 */
export default function makeHandlerAwareOfAsyncErrors(handler: RequestHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

import jwt from 'jsonwebtoken';
import { jwtConfig } from '@/config';
import type { NextFunction, Request, Response } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res
        .status(401)
        .json({
          status: '401',
          message: 'Токен отсутствует',
        })
        .end();
      return;
    } else {
      jwt.verify(token, jwtConfig.secret as string, (err: unknown) => {
        if (err) {
          throw err;
        }

        next();
      });
    }
  } catch (e) {
    if (e instanceof Error && e.name === 'TokenExpiredError') {
      res.status(401).json({
        status: '401',
        message: 'Токен протух',
        e,
      });
      return;
    }

    res.status(401).json({
      status: '401',
      message: 'Неверный токен',
      e,
    });
  }
};

export default authMiddleware;

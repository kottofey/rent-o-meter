import jwt from 'jsonwebtoken';
import { jwtConfig } from '@/config';
import type { NextFunction, Request, Response } from 'express';
import { refreshToken } from 'src/helpers/refreshJwtTokens.ts';

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        status: '401',
        reason: 'TokenMissing',
        message: 'Токен отсутствует',
      });
      return;
    }

    jwt.verify(token, jwtConfig.secret as string, async (err: unknown) => {
      if (err) {
        if (err instanceof Error && err.name === 'TokenExpiredError') {
          // Токен протух, пробуем обновить
          await refreshToken(req, res, next);
          return;
        } else {
          res.status(401).json({
            status: '401',
            reason: 'TokenInvalid',
            message: 'Неверный токен',
          });
          return;
        }
      }

      // Всё пучком, продолжаем
      next();
    });
  } catch (e) {
    res.status(500).json({
      status: '500',
      reason: 'InternalError',
      message: 'Внутренняя ошибка сервера',
      e,
    });
  }
};

export default authMiddleware;

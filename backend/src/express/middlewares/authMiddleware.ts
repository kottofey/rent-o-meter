import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

import { jwtConfig } from '@/config';
import { RefreshToken, User } from '@/models';
import { refreshToken } from 'src/helpers/refreshJwtTokens.ts';
import { useHandleError } from '@/helpers';

const { sendCustomResponse, handleError } = useHandleError();

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log('auth mw, начинаем');
  try {
    const token = req.cookies.token as string;
    console.log('auth mw, достаем токен');

    if (!token) {
      sendCustomResponse({
        res,
        respCode: 401,
        message: 'Токен отсутствует',
        reason: 'TokenMissing',
      });
      return;
    }

    console.log('auth mw, Декодируем токен, exp игнорируем');

    // Декодируем и проверяем не отозван ли токен в БД
    const decoded = jwt.verify(token, jwtConfig.secret, {
      ignoreExpiration: true,
    }) as Partial<User>;

    console.log('auth mw, Декодировали, Ищем токен в БД');

    const dbToken = await RefreshToken.findOne({
      where: { user_id: decoded.id, is_revoked: false },
    });

    console.log('auth mw, Нашли токен в БД');

    if (!dbToken?.id) {
      res.cookie('refreshToken', '', { maxAge: 0 });
      res.cookie('token', '', { maxAge: 0 });

      sendCustomResponse({
        res,
        respCode: 401,
        message: 'Токен отсутствует',
        reason: 'TokenMissing',
      });
      return;
    }
    try {
      console.log('auth mw, Проверяем валидность токена (подпись + срок)');

      // Проверяем валидность токена (подпись + срок)
      jwt.verify(token, jwtConfig.secret);
      console.log('auth mw, Всё ок, продолжаем');

      next();
    } catch (e) {
      if (e instanceof Error && e.name === 'TokenExpiredError') {
        console.log('auth mw, Токен протух, пробуем обновить, вызываем refreshToken');

        // Токен протух, пробуем обновить
        await refreshToken(req, res, next);
      } else {
        console.error('А вот этого происходить по идее не должно...', e);
      }
    }
  } catch (e) {
    console.log('auth mw, catch всего try');

    handleError({ e, res });
  }
};

export default authMiddleware;

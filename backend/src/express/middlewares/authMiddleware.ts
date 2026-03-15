import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

import { jwtConfig } from '@/config';
import { RefreshToken, User } from '@/models';
import { refreshToken } from 'src/helpers/refreshJwtTokens.ts';
import { useHandleError } from '@/helpers';

const { sendCustomResponse, handleError } = useHandleError();

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token as string;

    if (!token) {
      sendCustomResponse({
        res,
        respCode: 401,
        message: 'Токен отсутствует',
        reason: 'TokenMissing',
      });
      return;
    }

    // Декодируем и проверяем не отозван ли токен в БД
    const decoded = jwt.verify(token, jwtConfig.secret, {
      ignoreExpiration: true,
    }) as Partial<User>;

    const dbToken = await RefreshToken.findOne({
      where: { user_id: decoded.id, is_revoked: false },
    });

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
      // Проверяем валидность токена (подпись + срок)
      jwt.verify(token, jwtConfig.secret);
      next();
    } catch (e) {
      if (e instanceof Error && e.name === 'TokenExpiredError') {
        // Токен протух, пробуем обновить
        await refreshToken(req, res, next);
      } else {
        // sendCustomResponse({
        //   res,
        //   respCode: 401,
        //   message: 'Срок действия токена истек',
        //   reason: 'RefreshTokenExpired',
        // });
        console.error('А вот этого происходить по идее не должно...', e);
      }
    }
    // jwt.verify(
    //   token,
    //   jwtConfig.secret,
    //
    //   err => {
    //     if ((err?.name === 'TokenExpiredError', token)) {

    //     } else {
    //       sendCustomResponse({
    //         res,
    //         respCode: 401,
    //         message: 'Неверный токен',
    //         reason: 'TokenInvalid',
    //       });
    //       return;
    //     }
    //
    //     // Всё пучком, продолжаем
    //     next();
    //   },
    // );
  } catch (e) {
    handleError({ e, res });
  }
};

export default authMiddleware;

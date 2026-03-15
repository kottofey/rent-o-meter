import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { jwtConfig } from '@/config';
import { RefreshToken, Role, User } from '@/models';
import { hashToken, generateTokens, useHandleError } from '@/helpers';

const { sendCustomResponse, handleError } = useHandleError();

export async function refreshToken(
  req: Request,
  res: Response,
  next?: NextFunction,
): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken as string;

    if (!refreshToken) {
      sendCustomResponse({
        res,
        respCode: 401,
        message: 'Refresh токен не указан',
        reason: 'RefreshTokenNotFound',
      });
      return;
    }

    // Проверяем токен через подпись JWT
    const decoded = jwt.verify(refreshToken, jwtConfig.secret, {
      ignoreExpiration: true,
    }) as Partial<User>;

    // Находим запись в БД по ХЭШУ токена
    const tokenHash = hashToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
      where: { token_hash: tokenHash },
      include: {
        model: User,
        include: [Role],
      },
    });

    // Проверяем валидность токена
    if (!storedToken) {
      sendCustomResponse({
        res,
        respCode: 401,
        message: 'Refresh токен не найден',
        reason: 'RefreshTokenNotFound',
      });
      return;
    } else if (storedToken.isExpired()) {
      await storedToken.update({ is_revoked: true });
      sendCustomResponse({
        res,
        respCode: 401,
        message: 'Refresh токен протух',
        reason: 'RefreshTokenExpired',
      });
      return;
    } else if (storedToken.user_id !== decoded.id) {
      // Попытка подменить токен - отзываем
      await storedToken.update({ is_revoked: true });
      sendCustomResponse({
        res,
        respCode: 401,
        message: 'Указан неверный Refresh токен',
        reason: 'RefreshTokenWrong',
      });
      return;
    } else {
      // Генерируем новые токены
      const st: RefreshToken = storedToken.toJSON();

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(st.user);

      await storedToken.update({ token_hash: hashToken(newRefreshToken) });

      res.cookie('token', accessToken, { httpOnly: true });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

      if (next) {
        // Continue with the request if next function is provided
        next();
      } else {
        // If called from middleware, we shouldn't send a response here
        // Just return to allow the original request to continue
        return;
      }
    }
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'TokenExpiredError') {
      const refreshToken = req.cookies.refreshToken as string;

      const decoded = jwt.verify(refreshToken, jwtConfig.secret, {
        ignoreExpiration: true,
      }) as Partial<User>;

      const tokenToRevoke = await RefreshToken.findOne({
        where: { token_hash: hashToken(refreshToken), user_id: decoded.id },
        include: {
          model: User,
          include: [Role],
        },
      });

      if (tokenToRevoke) {
        await tokenToRevoke.update({ is_revoked: true });
      }

      sendCustomResponse({
        res,
        respCode: 401,
        message: 'Refresh токен протух',
        reason: 'RefreshTokenExpired',
      });
      return;
    } else {
      handleError({ e, res });
    }
  }
}

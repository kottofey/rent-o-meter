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
    console.log('refresh token, достаем токен');
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

    console.log('refresh token, есть токен, Проверяем токен через подпись JWT без exp');

    // Проверяем токен через подпись JWT
    const decoded = jwt.verify(refreshToken, jwtConfig.secret, {
      ignoreExpiration: true,
    }) as Partial<User>;

    console.log('refresh token, Находим запись в БД по ХЭШУ токена');

    // Находим запись в БД по ХЭШУ токена
    const tokenHash = hashToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
      where: { token_hash: tokenHash },
      include: {
        model: User,
        include: [Role],
      },
    });

    console.log('refresh token, Нашли токен в БД, Проверяем валидность токена');

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
      console.log('refresh token, refresh token протух, сессия завершена');

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
      console.log('refresh token, Вроде все ок, Обновляем обычный токен');

      const st: RefreshToken = storedToken.toJSON();

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(st.user);

      await storedToken.update({ token_hash: hashToken(newRefreshToken) });

      res.cookie('token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      req.cookies.token = accessToken;
      req.cookies.refreshToken = newRefreshToken;
      console.log('refresh token, выслали новые куки с рефреш и обычным токеном и обновили req');

      if (next) {
        console.log('refresh token, некст');
        // Continue with the request if next function is provided
        next();
      } else {
        // If called from middleware, we shouldn't send a response here
        // Just return to allow the original request to continue
        console.log('refresh token, ретурн');
        return;
      }
    }
  } catch (e: unknown) {
    console.log('refresh token, глобальный catch, определяем ошибку');

    if (e instanceof Error && e.name === 'TokenExpiredError') {
      const refreshToken = req.cookies.refreshToken as string;
      console.log('refresh token, рефреш токен таки протух, отзываем из БД');

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
      console.log('refresh token, НЕчто иное...');

      handleError({ e, res });
    }
  }
}

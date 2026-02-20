import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import chalk from 'chalk';

import { jwtConfig } from '@/config';
import { RefreshToken, Role, User } from '@/models';
import { hashToken, generateTokens } from '@/helpers';

export async function refreshToken(
  req: Request,
  res: Response,
  next?: NextFunction,
): Promise<void> {
  try {
    console.log('refreshToken, запуск');
    const refreshToken = req.cookies.refreshToken as string;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh токен не указан',
      });
      return;
    }

    // Проверяем токен через подпись JWT
    const decoded = jwt.verify(refreshToken, jwtConfig.secret, {}) as Partial<User>;

    // Находим запись в БД по ХЭШУ токена
    const tokenHash = hashToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
      where: { token_hash: tokenHash },
      include: {
        model: User,
        include: [Role],
      },
    });
    console.log('refreshToken, Проверяем валидность токена');
    // Проверяем валидность токена
    if (!storedToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh токен не найден',
      });
      return;
    } else if (storedToken.isExpired()) {
      await storedToken.update({ is_revoked: true });
      res.status(401).json({
        success: false,
        reason: 'RefreshTokenExpired',
        message: 'Refresh токен протух 51',
      });
      return;
    } else if (storedToken.user_id !== decoded.id) {
      await storedToken.update({ is_revoked: true });
      res.status(401).json({
        success: false,
        message: 'Указан неверный Refresh токен',
      });
      return;
    } else {
      console.log('refreshToken, всё ок, Генерируем новые токены');
      // Генерируем новые токены
      const st: RefreshToken = storedToken.toJSON();
      console.log('refreshToken, нашли юзера в токене');

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(st.user);

      console.log('refreshToken, токены готовы');

      await storedToken.update({ token_hash: hashToken(newRefreshToken) });

      console.log('refreshToken, обновили рефреш токен в БД');

      res.cookie('token', accessToken, { httpOnly: true });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

      console.log('refreshToken, обновили токены в куки');

      if (next) {
        console.log('refreshToken, некст');
        // Continue with the request if next function is provided
        next();
      } else {
        console.log('refreshToken, ретурн');
        // If called from middleware, we shouldn't send a response here
        // Just return to allow the original request to continue
        return;
      }
    }
  } catch (e) {
    if (e instanceof Error && e.name === 'TokenExpiredError') {
      console.log('refreshToken, протух, отзываем');
      try {
        const refreshToken = req.cookies.refreshToken as string;

        const decoded = jwt.verify(refreshToken, jwtConfig.secret, {
          ignoreExpiration: true,
        }) as Partial<User>;

        console.log('refreshToken, ищем что отозвать');

        const tokenToRevoke = await RefreshToken.findOne({
          where: { token_hash: hashToken(refreshToken), user_id: decoded.id },
          include: {
            model: User,
            include: [Role],
          },
        });

        if (tokenToRevoke) {
          console.log('refreshToken, нашли, отзываем');
          await tokenToRevoke.update({ is_revoked: true });
        }

        console.log('refreshToken, отозвали, шлем ответ');

        res.status(401).json({
          success: false,
          reason: 'RefreshTokenExpired',
          message: 'Refresh токен протух 121',
        });
        return;
      } catch (e) {
        console.error('local catch:', e);
      }
    } else {
      console.log('refreshToken, ошибка сервера?..', e);
      res.status(500).json({
        status: '500',
        reason: 'InternalError',
        message: 'Внутренняя ошибка сервера',
        e,
      });
    }
  }
}

import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { jwtConfig } from '@/config';
import { RefreshToken, Role, User } from '@/models';
import { hashToken, generateTokens, getDeviceId, dayjs, useHandleError } from '@/helpers';

const { handleError, sendCustomResponse } = useHandleError();

// -----------------------------------------------------------------------------
// Controllers
// -----------------------------------------------------------------------------

async function register(req: Request, res: Response): Promise<void> {
  try {
    const { surname, firstname, patronymic, email, password, role, comment } = req.body as User & {
      role: string;
    };

    // Проверка существования пользователя
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      sendCustomResponse({
        res,
        respCode: 400,
        message: 'Пользователь с таким email уже существует',
        reason: 'UserExists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const roleName = role || 'rentee';
    const userRole = await Role.findOne({ where: { name: roleName } });

    if (userRole) {
      const user = await User.create({
        email,
        firstname,
        surname,
        patronymic,
        password: hashedPassword,
        comment,
      });

      await user.$add('Role', userRole);

      res.status(200).json({
        success: true,
        message: 'Пользователь зарегистрирован',
        user: {
          id: user.id,
          email: user.email,
          surname: user.surname,
          firstname: user.firstname,
          patronymic: user.patronymic,
          comment: user.comment,
        },
      });
    } else {
      sendCustomResponse({
        res,
        respCode: 400,
        message: `Роли ${roleName} не существует`,
        reason: 'RoleNotFound',
      });
      return;
    }
  } catch (e) {
    handleError({ e, res });
  }
}

async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as User;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: 'roles',
        },
      ],
    });

    if (user === null) {
      sendCustomResponse({
        res,
        respCode: 404,
        message: 'Пользователь не найден',
        reason: 'UserNotFound',
      });
    } else {
      if (!(await bcrypt.compare(password, user.password))) {
        res.status(401).json({
          success: false,
          message: 'Неверные учетные данные',
        });
        sendCustomResponse({
          res,
          respCode: 401,
          message: 'Неверные учетные данные',
          reason: 'UserNotAuthorized',
        });
        return;
      }
      if (!user.status) {
        sendCustomResponse({
          res,
          respCode: 403,
          message: 'Пользователь заблокирован',
          reason: 'UserBlocked',
        });
        return;
      }

      // Отзываем старые токены при новом логине
      // То есть, логин может быть только на одном устройстве
      await RefreshToken.update(
        { is_revoked: true },
        {
          where: {
            user_id: user.id,
            is_revoked: false,
          },
        },
      );

      const { accessToken, refreshToken } = generateTokens(user.toJSON());

      await RefreshToken.create({
        user_id: user.id,
        token_hash: hashToken(refreshToken),
        expires_at: jwtConfig.refreshTokenExpiresIn,
        user_agent: req.headers['user-agent'],
        ip: req.ip ?? req.headers['x-forwarded-for'],
        device_id: getDeviceId(req),
      });

      // TODO дополнить токены опциями secure: true, sameSite: strict

      res.cookie('token', accessToken, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });

      await user.update({
        last_login: dayjs().toDate(),
      });

      res.json({
        success: true,
        message: 'Успешный вход',
        user: {
          id: user.id,
          rentee_id: user.rentee_id,
          email: user.email,
          status: user.status,
          surname: user.surname,
          firstname: user.firstname,
          patronymic: user.patronymic,
          roles: user.roles.map(r => r.name),
        },
      });
    }
  } catch (e) {
    handleError({ e, res });
  }
}

async function logout(req: Request, res: Response): Promise<void> {
  try {
    // Тупо отзываем refresh token и удаляем куки
    const refreshToken = req.cookies.refreshToken as string;
    const token = req.cookies.token as string;

    const decoded = jwt.verify(token, jwtConfig.secret, {
      ignoreExpiration: true,
    }) as Partial<User>;

    if (!refreshToken) {
      sendCustomResponse({
        res,
        respCode: 400,
        message: 'Refresh token не предоставлен',
        reason: 'RefreshTokenNotFound',
      });
    }

    const refreshTokenHash = hashToken(refreshToken);

    await RefreshToken.update(
      { is_revoked: true },
      { where: { token_hash: refreshTokenHash, user_id: decoded.id } },
    );

    res.cookie('refreshToken', '', { maxAge: 0 });
    res.cookie('token', '', { maxAge: 0 });

    res.json({
      success: true,
      message: 'Выход выполнен успешно',
    });
  } catch (e) {
    handleError({ e, res });
  }
}

async function me(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.token as string;

    const decoded = jwt.verify(token, jwtConfig.secret) as Partial<User>;

    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: 'roles' }],
    });

    if (!user) {
      sendCustomResponse({
        res,
        respCode: 404,
        message: 'Пользователь не найден',
        reason: 'UserNotFound',
      });
    }

    if (user) {
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          rentee_id: user.rentee_id,
          status: user.status,
          surname: user.surname,
          firstname: user.firstname,
          patronymic: user.patronymic,
          email: user.email,
          roles: user.roles.map(r => r.name),
          last_login: user.last_login,
          comment: user.comment,
        },
      });
    }
  } catch (e) {
    handleError({ e, res });
  }
}

export default {
  register,
  login,
  logout,
  me,
};

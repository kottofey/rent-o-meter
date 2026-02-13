import { type Request, type Response } from 'express';
import { jwtConfig } from '@/config';

import jwt from 'jsonwebtoken';
import { RefreshToken, Role, User } from '@/models';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { getIdParam } from 'src/express/helpers.ts';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
interface IUserPayload {
  id: number;
  surname: string;
  firstname: string;
  patronymic: string;
  email: string;
  roles: string;
}

// Хэширование токена для сохранения в БД
const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Генерация уникального идентификатора устройства
const getDeviceId = (req: Request) => {
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.ip || req.headers['x-forwarded-for'] || '';
  return crypto.createHash('md5').update(`${userAgent}${ip}`).digest('hex');
};

const generateTokens = async (userPayload: Partial<User>, req: Request) => {
  const payload = {
    id: userPayload.id,
    fio: userPayload.surname + ' ' + userPayload.firstname + ' ' + userPayload.patronymic,
    email: userPayload.email,
    roles: userPayload.roles,
  };

  const accessToken = jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

  const refreshToken = jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.refreshTokenExpiresIn,
  });

  // Сохраняем ХЭШ refresh token в БД
  const tokenHash = hashToken(refreshToken);
  const deviceId = getDeviceId(req);

  try {
    await RefreshToken.create({
      user_id: userPayload.id,
      token_hash: tokenHash,
      expires_at: jwtConfig.refreshTokenExpiresIn,
      user_agent: req.headers['user-agent'],
      ip: req.ip || req.headers['x-forwarded-for'],
      device_id: deviceId,
    });
  } catch (e) {
    throw e;
  }

  return { accessToken, refreshToken };
};

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
      res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      firstname,
      surname,
      patronymic,
      password: hashedPassword,
      comment,
    });

    const roleName = role || 'rentee';
    const userRole = await Role.findOne({ where: { name: roleName } });

    if (userRole) {
      await user.$add('Role', userRole);
    } else {
      res.status(400).json({
        success: false,
        message: `Роли ${roleName} не существует`,
      });
      return;
    }

    const { accessToken, refreshToken } = await generateTokens(
      {
        ...user.toJSON(),
        roles: userRole?.toJSON().name ?? '',
      },
      req,
    );

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
  } catch (e) {
    console.error('Ошибка регистрации', e);
    throw e;
  }
}

async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as User;

    const user = await User.findOne({ where: { email }, include: Role });

    if (user === null) {
      res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      });
    } else {
      if (!(await bcrypt.compare(password, user.password))) {
        res.status(401).json({
          success: false,
          message: 'Неверные учетные данные',
        });
      }

      if (!user?.status) {
        res.status(403).json({
          success: false,
          message: 'Пользователь заблокирован',
        });
      }

      // Отзываем старые токены при новом логине
      // То есть, логин может быть только на одном устройстве
      const q = await RefreshToken.update(
        { is_revoked: true },
        {
          where: {
            user_id: user.id,
            is_revoked: false,
          },
        },
      );

      const { accessToken, refreshToken } = await generateTokens(user, req);

      // TODO дополнить токены опциями secure: true, sameSite: strict

      res.cookie('token', accessToken, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });

      res.json({
        success: true,
        message: 'Успешный вход',
        user: {
          id: user.id,
          email: user.email,
          surname: user.surname,
          firstname: user.firstname,
          patronymic: user.patronymic,
          roles: (user.toJSON() as User).roles.map(r => r.name),
        },
        accessToken,
        refreshToken,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Ошибка при входе',
      e,
    });
  }
}

async function logout(req: Request, res: Response): Promise<void> {
  try {
    // Тупо отзываем refresh token и удаляем куки
    const refreshToken = req.cookies.refreshToken;
    const decoded = jwt.verify(req.cookies.token, jwtConfig.secret) as Partial<User>;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token не предоставлен',
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
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Ошибка при выходе',
      e,
    });
  }
}

async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token не предоставлен',
      });
    }

    // Проверяем токен через подпись JWT
    const decoded = jwt.verify(refreshToken, jwtConfig.secret) as Partial<User>;

    // Находим запись в БД по ХЭШУ токена
    const tokenHash = hashToken(refreshToken);
    const storedToken = await RefreshToken.findOne({
      where: { token_hash: tokenHash },
      include: {
        model: User,
      },
    });

    // Проверяем валидность токена
    if (!storedToken || !storedToken.isValid() || storedToken.toJSON().user_id !== decoded.id) {
      res.status(401).json({
        success: false,
        message: 'Неверный или отозванный refresh token',
      });
    } else {
      // Генерируем новые токены
      const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
        storedToken.toJSON().user,
        req,
      );

      // Отзываем старый refresh token и устанавливаем новые
      // TODO дополнить токены опциями secure: true, sameSite: strict
      await storedToken.update({ is_revoked: true });
      res.cookie('token', accessToken, { httpOnly: true });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

      res.json({
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении токена',
      e,
    });
  }
}

async function me(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.token;

    const decoded = jwt.verify(token, jwtConfig.secret) as Partial<User>;

    const userRaw = await User.findByPk(decoded.id, {
      include: [{ model: Role }],
    });

    if (!userRaw) {
      res.status(404).json({
        success: false,
        message: 'Пользователь не найден',
      });
    }

    const user = userRaw?.toJSON() as User;

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        rentee_id: user.rentee_id,
        surname: user.surname,
        firstname: user.firstname,
        patronymic: user.patronymic,
        email: user.email,
        roles: user.roles.map(r => r.name),
        last_login: user.last_login,
        comment: user.comment,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении профиля',
      e,
    });
  }
}

export default {
  register,
  login,
  logout,
  refreshToken,
  me,
};

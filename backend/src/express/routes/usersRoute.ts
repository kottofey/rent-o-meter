import { type Request, type Response } from 'express';
import * as bcrypt from 'bcrypt';

import { getIdParam } from '../helpers.ts';

import { sequelize } from '@/sequelize';
import { parseQuery, useHandleError } from '@/helpers';
import { RefreshToken, Role, User } from '@/models';

const model = sequelize.models.User;
const { handleError, sendCustomResponse } = useHandleError();

async function getAll(req: Request, res: Response) {
  const { includes, scopes } = parseQuery(req.query);

  try {
    const found = await model.scope(scopes).findAll({
      include: includes,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });
    res.status(200).json(found).end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function getById(req: Request, res: Response) {
  const id = getIdParam(req);
  const { includes, scopes } = parseQuery(req.query);

  if (!id) {
    sendCustomResponse({
      res,
      respCode: 400,
      message: 'ID must be provided as parameter',
      reason: 'NoIdProvided',
    });
    return;
  }

  try {
    const found = await model.scope(scopes).findByPk(id, {
      include: includes,
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });

    res.status(200).json(found).end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { surname, firstname, patronymic, email, password, role, comment } = req.body as User & {
      role: string;
    };

    // Проверка существования пользователя
    const existingUser = await User.findOne({ where: { email }, paranoid: false });

    if (existingUser) {
      sendCustomResponse({
        res,
        respCode: 400,
        message: 'Пользователь с таким email уже существует',
        reason: 'UserExists',
      });
      return;
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

async function remove(req: Request, res: Response) {
  const id = getIdParam(req);

  try {
    await model.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({ message: 'Deleted' }).end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function update(req: Request, res: Response) {
  const id = getIdParam(req);
  const { password, status, ...rest } = req.body as Partial<User>;

  try {
    // Проверка существования пользователя
    const existingUser = await User.findOne({
      where: { id },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });

    if (!existingUser) {
      sendCustomResponse({
        res,
        respCode: 404,
        message: 'Пользователя не существует',
        reason: 'UserNotFound',
      });
    } else {
      if (!status) {
        await RefreshToken.update({ is_revoked: true }, { where: { user_id: existingUser.id } });
      }

      const updatedUser = await existingUser.update({
        ...rest,
        status,
        password: password && (await bcrypt.hash(password, 10)),
      });

      const updatedUserJson: Partial<User> = updatedUser.toJSON();
      delete updatedUserJson.password;

      res.status(200).json(updatedUserJson).end();
    }
  } catch (e) {
    handleError({ e, res });
  }
}

async function restore(req: Request, res: Response) {
  const id = getIdParam(req);

  try {
    await model.restore({
      where: {
        id,
      },
    });

    res.status(200).json({ message: 'Restored' }).end();
  } catch (e) {
    handleError({ e, res });
  }
}

export default { getById, getAll, create, update, remove, restore };

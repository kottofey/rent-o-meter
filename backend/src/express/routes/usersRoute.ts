import { type Request, type Response } from 'express';
import * as bcrypt from 'bcrypt';

import { getIdParam } from '../helpers.ts';

import { sequelize } from '@/sequelize';
import { parseQuery, useHandleError } from '@/helpers';
import { RefreshToken, User } from '@/models';

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
    res.status(200).send(found).end();
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
    const found =
      (await model.scope(scopes).findOne({
        where: {
          id,
        },
        include: includes,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
      })) ?? {};

    res.status(200).send(found).end();
  } catch (e) {
    handleError({ e, res });
  }
}

// async function create(req: Request, res: Response) {
//   if (req.body.id) {
//     res.status(400).send({
//       message: 'ID should not be provided, since it is determined automatically by the database.',
//     });
//     return;
//   }
//
//   try {
//     await model.create(req.body);
//     res
//       .status(201)
//       .send({ ...req.body })
//       .end();
//   } catch (e) {
//     if (e instanceof UniqueConstraintError) {
//       res.status(409).send({ error: e.parent.message }).end();
//     } else {
//       res.status(500).send({ e }).end();
//     }
//   }
// }

async function remove(req: Request, res: Response) {
  const id = getIdParam(req);

  const count = await model.count({
    where: { id },
  });

  if (count === 0) {
    sendCustomResponse({
      res,
      respCode: 404,
      message: 'Record not found',
      reason: 'NotFound',
    });
    return;
  }
  try {
    await model.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({ message: 'Deleted' }).end();
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
        respCode: 400,
        message: 'Пользователя не существует',
        reason: 'UserNotFound',
      });
    } else {
      if (!status) {
        await RefreshToken.update({ is_revoked: true }, { where: { user_id: existingUser.id } });
      }

      const updatedUser = await existingUser.update({
        ...rest,
        password: password && (await bcrypt.hash(password, 10)),
      });

      const result: Partial<User> = updatedUser.toJSON();
      delete result.password;

      res
        .status(200)
        .send({
          message: 'Updated',
          user: result,
        })
        .end();
    }
  } catch (e) {
    handleError({ e, res });
  }
}

async function restore(req: Request, res: Response) {
  const id = getIdParam(req);

  try {
    await model.restore({ where: { id } });

    res.status(200).send({ message: 'Restored' }).end();
  } catch (e) {
    handleError({ e, res });
  }
}

export default { getById, getAll, update, remove, restore };

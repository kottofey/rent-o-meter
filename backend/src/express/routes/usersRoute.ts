import { type Request, type Response } from 'express';
import { sequelize } from '@/sequelize';
import { getIdParam } from '../helpers.ts';
import { hashToken, parseQuery } from '@/helpers';
import { RefreshToken, User } from '@/models';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '@/config';

const model = sequelize.models.User;

async function getAll(req: Request, res: Response) {
  const { includes, scopes } = parseQuery(req.query);

  try {
    const found =
      (await model.scope(scopes).findAll({
        include: includes,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password'],
        },
      })) ?? {};
    res.status(200).send(found).end();
  } catch (e) {
    res.status(500).send({ error: e }).end();
  }
}

async function getById(req: Request, res: Response) {
  const id = getIdParam(req);
  const { includes, scopes } = parseQuery(req.query);

  if (!id) {
    res.status(400).send({
      message: 'Bad request: proper ID should be provided as parameter',
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
    res.status(500).send({ error: e }).end();
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
    res.status(404).send({ message: 'Record not found' }).end();
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
    res.status(500).send({ error: e }).end();
  }
}

async function update(req: Request, res: Response) {
  const id = getIdParam(req);
  const { password, status } = req.body as User;

  try {
    // Проверка существования пользователя
    const existingUser = await User.findOne({
      where: { id },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });

    if (!existingUser) {
      res.status(400).json({
        success: false,
        message: 'Пользователя не существует',
      });
    } else {
      if (!status) {
        await RefreshToken.update({ is_revoked: true }, { where: { user_id: existingUser.id } });
      }

      const updatedUser = await existingUser.update({
        ...req.body,
        password: password && (await bcrypt.hash(password, 10)),
      });

      const result = { ...updatedUser.toJSON() };
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
    if (e instanceof Error) {
      res.status(500).send({ error: e.message }).end();
    } else {
      res.status(500).send(e).end();
    }
  }
}

async function restore(req: Request, res: Response) {
  const id = getIdParam(req);

  try {
    await model.restore({ where: { id } });

    res.status(200).send({ message: 'Restored' }).end();
  } catch (e) {
    res.status(500).send({ error: e }).end();
  }
}

export default { getById, getAll, update, remove, restore };

import { type Request, type Response } from 'express';
import { sequelize } from '@/sequelize';
import { UniqueConstraintError } from 'sequelize';
import chalk from 'chalk';
import { getIdParam } from '../helpers.ts';
import { parseQuery } from '@/helpers';

const model = sequelize.models.Bill;

async function getAll(req: Request, res: Response) {
  try {
    const { includes, scopes } = parseQuery(req.query);

    const found =
      (await model.scope(scopes).findAll({
        include: includes,
        attributes: {
          exclude: ['deletedAt', 'createdAt', 'updatedAt'],
        },
      })) ?? {};
    res.status(200).send(found).end();
  } catch (e) {
    res.status(500).send({ e }).end();
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
          exclude: ['deletedAt', 'createdAt', 'updatedAt'],
        },
      })) ?? {};

    res.status(200).send(found).end();
  } catch (e) {
    res.status(500).send({ error: e }).end();
  }
}

async function create(req: Request, res: Response) {
  if (req.body.id) {
    res.status(400).send({
      message: 'ID should not be provided, since it is determined automatically by the database.',
    });
    return;
  }
  // TODO написать валидацию прилетевших данных
  try {
    await model.create(req.body);
    res.status(201).send({ message: 'Created', statusCode: 201 }).end();
  } catch (e) {
    if (e instanceof UniqueConstraintError) {
      res.status(409).send({ error: e.parent.message, statusCode: 409 }).end();
    }
  }
}

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
    res.status(500).send({ e }).end();
  }
}

async function update(req: Request, res: Response) {
  const id = getIdParam(req);
  const { body }: { body: Partial<unknown> } = req;

  try {
    const [rows] = await model.update(body, {
      where: {
        id,
      },
      paranoid: false,
    });

    res.status(200).send({ rowsAffected: rows }).end();
  } catch (e) {
    res.status(500).send({ e }).end();
  }
}

async function restore(req: Request, res: Response) {
  const id = getIdParam(req);

  try {
    await model.restore({ where: { id } });

    res.status(200).send({ message: 'Restored' }).end();
  } catch (e) {
    res.status(500).send({ e }).end();
  }
}

export default { getById, getAll, create, update, remove, restore };

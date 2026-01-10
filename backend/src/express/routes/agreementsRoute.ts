import { type Request, type Response } from 'express';
import { sequelize } from '@/sequelize';
import { UniqueConstraintError } from 'sequelize';
import QueryString from 'qs';

import chalk from 'chalk';
import { getIdParam } from '../helpers.ts';
import { Rentee } from '@/models';

const model = sequelize.models.Agreement;

async function getAll(req: Request, res: Response) {
  const parsedQuery: QueryString.ParsedQs = req.query;

  const scopes: {
    withPaymonth: boolean;
    isDebt: boolean;
    toSend: any[];
  } = {
    withPaymonth: false,
    isDebt: false,
    toSend: [],
  };

  if (Object(parsedQuery).scopes?.includes('withPaymonth')) {
    scopes.toSend.push({ method: ['withPaymonth'] });
  }

  if (Object(parsedQuery).scopes?.includes('isDebt')) {
    scopes.toSend.push({ method: ['isDebt'] });
  }

  const found =
    (await model.scope(scopes.toSend).findAll({
      include: {
        model: Rentee,
        attributes: {
          exclude: ['deletedAt', 'createdAt', 'updatedAt'],
        },
      },
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt'],
      },
    })) ?? {};
  res.status(200).send(found).end();
}

async function getById(req: Request, res: Response) {
  const id = getIdParam(req);

  if (!id) {
    res.status(400).send({
      message: 'Bad request: proper ID should be provided as parameter',
    });
    return;
  }

  const found =
    (await model.findOne({
      where: {
        id,
      },
      include: {
        model: Rentee,
        attributes: {
          exclude: ['deletedAt', 'createdAt', 'updatedAt'],
        },
      },
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt'],
      },
    })) ?? {};

  res.status(200).send(found).end();
}

async function create(req: Request, res: Response) {
  if (req.body.id) {
    res.status(400).send({
      message: 'ID should not be provided, since it is determined automatically by the database.',
    });
    return;
  }

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

  await model.destroy({
    where: {
      id,
    },
  });

  res.status(200).send({ message: 'Deleted' }).end();
}

async function update(req: Request, res: Response) {
  const id = getIdParam(req);
  const { body }: { body: Partial<unknown> } = req;

  const [rows] = await model.update(body, {
    where: {
      id,
    },
    paranoid: false,
  });

  res.status(200).send({ rowsAffected: rows }).end();
}

async function restore(req: Request, res: Response) {
  const id = getIdParam(req);

  // const isDeleted = id && (await isClientDeleted(id));

  // if (!isDeleted) {
  //   res.status(404).send({ message: 'This client either not deleted or does not exist' }).end();
  //   return;
  // }

  await model.restore({
    where: {
      id,
    },
  });

  res.status(200).send({ message: 'Restored' }).end();
}

export default { getById, getAll, create, update, remove, restore };

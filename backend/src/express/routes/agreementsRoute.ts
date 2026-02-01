import { type Request, type Response } from 'express';
import { sequelize } from '@/sequelize';
import { UniqueConstraintError } from 'sequelize';

import chalk from 'chalk';
import { getIdParam } from '../helpers.ts';
import { parseQuery } from '@/helpers';

const model = sequelize.models.Agreement;

async function getAll(req: Request, res: Response) {
  const { includes, scopes } = parseQuery(req.query);

  try {
    const found =
      (await model.scope(scopes).findAll({
        include: includes,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
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
      (await model.scope(scopes).findByPk(id, {
        include: includes,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
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

  try {
    await model.create(req.body);
    res.status(201).send({ message: 'Created' }).end();
  } catch (e) {
    if (e instanceof UniqueConstraintError) {
      res.status(409).send({ error: e.parent.message }).end();
    } else if (e instanceof Error) {
      res.status(500).send({ message: e.message }).end();
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
    await model.update(
      { status: false },
      {
        where: { id },
      },
    );
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
  const { body }: { body: Partial<unknown> } = req;

  try {
    const agreement = await model.findByPk(id, { paranoid: false });

    if (agreement) {
      // agreement.set(body);
      const updatedModel = await agreement.update(body, {
        where: {
          id,
        },
      });
      res
        .status(200)
        .send({ ...updatedModel })
        .end();
    }
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).send({ name: e.name, message: e.message, cause: e.cause }).end();
    }
  }
}

async function restore(req: Request, res: Response) {
  const id = getIdParam(req);

  // const isDeleted = id && (await isClientDeleted(id));

  // if (!isDeleted) {
  //   res.status(404).send({ message: 'This client either not deleted or does not exist' }).end();
  //   return;
  // }
  try {
    await model.restore({
      where: {
        id,
      },
    });

    res.status(200).send({ message: 'Restored' }).end();
  } catch (e) {
    res.status(500).send({ error: e }).end();
  }
}

export default { getById, getAll, create, update, remove, restore };

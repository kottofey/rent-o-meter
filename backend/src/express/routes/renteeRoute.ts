import { type Request, type Response } from 'express';

import { getIdParam } from '../helpers.ts';

import { Rentee, Tarif } from '@/models';
import { parseQuery, useHandleError } from '@/helpers';

const { handleError } = useHandleError();

async function getAll(req: Request, res: Response) {
  const { includes, scopes } = parseQuery(req.query);
  try {
    const found = await Rentee.scope(scopes).findAll({
      include: includes,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
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
    res.status(400).send({
      message: 'Bad request: proper ID should be provided as parameter',
    });
    return;
  }
  try {
    const found =
      (await Rentee.scope(scopes).findOne({
        where: {
          id,
        },
        include: includes,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      })) ?? {};

    res.status(200).send(found).end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function create(req: Request, res: Response) {
  const rentee = req.body as Partial<Tarif>;

  if (rentee.id) {
    res.status(400).send({
      message: 'ID should not be provided, since it is determined automatically by the database.',
    });
    return;
  }

  try {
    await Rentee.create(rentee);
    res
      .status(201)
      .send({ ...rentee })
      .end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function remove(req: Request, res: Response) {
  const id = getIdParam(req);

  const count = await Rentee.count({
    where: { id },
  });

  if (count === 0) {
    res.status(404).send({ message: 'Record not found' }).end();
    return;
  }
  try {
    await Rentee.destroy({
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
  const rentee = req.body as Partial<Rentee>;

  try {
    const [rows] = await Rentee.update(rentee, {
      where: {
        id,
      },
      paranoid: false,
    });

    if (rows === 0) {
      res.status(404).send({}).end();
    } else {
      res
        .status(200)
        .send({ ...req.body })
        .end();
    }
  } catch (e) {
    handleError({ e, res });
  }
}

async function restore(req: Request, res: Response) {
  const id = getIdParam(req);

  try {
    await Rentee.restore({ where: { id } });

    res.status(200).send({ message: 'Restored' }).end();
  } catch (e) {
    handleError({ e, res });
  }
}

export default { getById, getAll, create, update, remove, restore };

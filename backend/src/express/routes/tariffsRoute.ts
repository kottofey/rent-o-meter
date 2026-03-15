import { type Request, type Response } from 'express';

import { getIdParam } from '../helpers.ts';

import { parseQuery, useHandleError } from '@/helpers';
import { Tarif } from '@/models';

const { handleError } = useHandleError();

async function getAll(req: Request, res: Response) {
  try {
    const { includes, scopes } = parseQuery(req.query);

    const found = await Tarif.scope(scopes).findAll({
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
      (await Tarif.scope(scopes).findOne({
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
  const tarif = req.body as Partial<Tarif>;

  if (tarif.id) {
    res.status(400).send({
      message: 'ID should not be provided, since it is determined automatically by the database.',
    });
    return;
  }

  try {
    await Tarif.create(tarif);
    res.status(201).send({ message: 'Created', statusCode: 201 }).end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function remove(req: Request, res: Response) {
  const id = getIdParam(req);

  const count = await Tarif.count({
    where: { id },
  });

  if (count === 0) {
    res.status(404).send({ message: 'Record not found' }).end();
    return;
  }
  try {
    await Tarif.destroy({
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
  const tarif = req.body as Partial<Tarif>;

  try {
    const [rows] = await Tarif.update(tarif, {
      where: {
        id,
      },
      paranoid: false,
    });

    res.status(200).send({ rowsAffected: rows }).end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function restore(req: Request, res: Response) {
  const id = getIdParam(req);

  try {
    await Tarif.restore({ where: { id } });

    res.status(200).send({ message: 'Restored' }).end();
  } catch (e) {
    handleError({ e, res });
  }
}

export default { getById, getAll, create, update, remove, restore };

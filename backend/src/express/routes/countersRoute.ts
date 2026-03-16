import { type Request, type Response } from 'express';

import { getIdParam } from '../helpers.ts';

import { parseQuery, useHandleError } from '@/helpers';
import { Counter } from '@/models';

const { handleError, sendCustomResponse } = useHandleError();

async function getAll(req: Request, res: Response) {
  try {
    const { includes, scopes } = parseQuery(req.query);

    const found = await Counter.scope(scopes).findAll({
      include: includes,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
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
      message: 'Bad request: proper ID should be provided as parameter',
      reason: 'NoIdProvided',
    });
    return;
  }

  try {
    const found = await Counter.scope(scopes).findByPk(id, {
      include: includes,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    res.status(200).json(found).end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function create(req: Request, res: Response) {
  const counter = req.body as Partial<Counter>;

  if (counter.id) {
    sendCustomResponse({
      res,
      respCode: 400,
      message: 'ID should not be provided, since it is determined automatically by the database.',
      reason: 'IncorrectBody',
    });
    return;
  }

  try {
    await Counter.create(counter);
    res.status(201).json(counter).end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function remove(req: Request, res: Response) {
  const id = getIdParam(req);

  try {
    await Counter.destroy({
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
  const counter = req.body as Partial<Counter>;

  try {
    await Counter.update(counter, {
      where: {
        id,
      },
    });

    res.status(200).json(counter).end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function restore(req: Request, res: Response) {
  const id = getIdParam(req);

  try {
    await Counter.restore({
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

import { type Request, type Response } from 'express';

import { getIdParam } from '../helpers.ts';

import { parseQuery, useHandleError } from '@/helpers';
import { Payment } from '@/models';

const { handleError, sendCustomResponse } = useHandleError();

async function getAll(req: Request, res: Response) {
  try {
    const { includes, scopes } = parseQuery(req.query);

    const found = await Payment.scope(scopes).findAll({
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
    const found = await Payment.scope(scopes).findByPk(id, {
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
  const payment = req.body as Partial<Payment>;

  if (payment.id) {
    sendCustomResponse({
      res,
      respCode: 400,
      message: 'ID should not be provided, since it is determined automatically by the database.',
      reason: 'IncorrectBody',
    });
    return;
  }

  try {
    await Payment.create(payment);
    res.status(201).json(payment).end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function remove(req: Request, res: Response) {
  const id = getIdParam(req);

  try {
    await Payment.destroy({
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
  const payment = req.body as Partial<Payment>;

  try {
    await Payment.update(payment, {
      where: {
        id,
      },
    });

    res.status(200).json(payment).end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function restore(req: Request, res: Response) {
  const id = getIdParam(req);

  try {
    await Payment.restore({
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

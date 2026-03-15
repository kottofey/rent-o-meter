import { type Request, type Response } from 'express';

import { getIdParam } from '../helpers.ts';

import { parseQuery, useHandleError } from '@/helpers';
import { Agreement } from '@/models';

const { handleError } = useHandleError();

async function getAll(req: Request, res: Response) {
  const { includes, scopes } = parseQuery(req.query);

  try {
    const found = await Agreement.scope(scopes).findAll({
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
      (await Agreement.scope(scopes).findByPk(id, {
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
  const agreement = req.body as Partial<Agreement>;

  if (agreement.id) {
    res.status(400).send({
      message: 'ID should not be provided, since it is determined automatically by the database.',
    });
    return;
  }

  try {
    await Agreement.create(agreement);
    res.status(201).send({ message: 'Created' }).end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function remove(req: Request, res: Response) {
  const id = getIdParam(req);

  const count = await Agreement.count({
    where: { id },
  });

  if (count === 0) {
    res.status(404).send({ message: 'Record not found' }).end();
    return;
  }

  try {
    await Agreement.update(
      { status: false },
      {
        where: { id },
      },
    );
    await Agreement.destroy({
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
  const agreement = req.body as Partial<Agreement>;

  try {
    await Agreement.update(agreement, {
      where: {
        id,
      },
    });
    res
      .status(200)
      .send({ ...agreement })
      .end();
  } catch (e) {
    handleError({ e, res });
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
    await Agreement.restore({
      where: {
        id,
      },
    });

    res.status(200).send({ message: 'Restored' }).end();
  } catch (e) {
    handleError({ e, res });
  }
}

export default { getById, getAll, create, update, remove, restore };

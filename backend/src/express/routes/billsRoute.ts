import { type Request, type Response } from 'express';

import { getIdParam } from '../helpers.ts';

import { parseQuery, useHandleError, calculateDebt } from '@/helpers';
import { Agreement, Bill } from '@/models';

const { handleError } = useHandleError();

async function getAll(req: Request, res: Response) {
  try {
    const { includes, scopes } = parseQuery(req.query);

    const found = await Bill.scope(scopes).findAll({
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
      (await Bill.scope(scopes).findOne({
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
  const { tarifs, ...billData } = req.body as Partial<Bill>;

  if (billData.id) {
    res.status(400).send({
      message: 'ID should not be provided, since it is determined automatically by the database.',
    });
    return;
  }

  // TODO написать валидацию прилетевших данных
  try {
    const bill = await Bill.create(billData);

    if (tarifs) {
      await bill.$set(
        'tarifs',
        tarifs.map(t => t.id as number),
      );
    }

    // -----------------------------------------------------------------------------
    // Обновляем значение долга по договру
    // -----------------------------------------------------------------------------

    const thisAgreement = await Agreement.findByPk(bill.agreementId, {
      include: [Bill],
    });

    await thisAgreement?.update({
      debt: calculateDebt(thisAgreement.toJSON()),
    });

    res.status(201).send({ message: 'Created', statusCode: 201 }).end();
  } catch (e) {
    handleError({ e, res });
  }
}

async function remove(req: Request, res: Response) {
  const id = getIdParam(req);

  const count = await Bill.count({
    where: { id },
  });

  if (count === 0) {
    res.status(404).send({ message: 'Record not found' }).end();
    return;
  }
  try {
    await Bill.destroy({
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
  const { tarifs, ...billData } = req.body as Partial<Bill>;

  try {
    const bill = await Bill.findByPk(id);

    if (bill && tarifs) {
      await Bill.update(billData, {
        where: { id },
        paranoid: false,
      });

      await bill.$set('tarifs', tarifs);

      // await bill.$set(
      //   'tarifs',
      //   tarifs?.map((t: Tarif) => t.id),
      // );

      // -----------------------------------------------------------------------------
      // Обновляем значение долга по договру
      // -----------------------------------------------------------------------------

      const thisAgreement = await Agreement.findByPk(bill.agreementId, {
        include: [Bill],
      });

      await thisAgreement?.update({
        debt: calculateDebt(thisAgreement.toJSON()),
      });

      res.status(200).send(bill.toJSON()).end();
    }
  } catch (e) {
    handleError({ e, res });
  }
}

async function restore(req: Request, res: Response) {
  const id = getIdParam(req);

  try {
    await Bill.restore({ where: { id } });

    res.status(200).send({ message: 'Restored' }).end();
  } catch (e) {
    handleError({ e, res });
  }
}

export default { getById, getAll, create, update, remove, restore };

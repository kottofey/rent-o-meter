import { type Request, type Response } from 'express';
import { sequelize } from '@/sequelize';
import { Op, UniqueConstraintError } from 'sequelize';
// import { getIdParam, isClientDeleted } from '../helpers.ts';
import { Rentee } from '@/models';
import chalk from 'chalk';
import { getIdParam } from '../helpers.ts';

const model = sequelize.models.Rentee;

async function getAll(req: Request, res: Response) {
  // const includes = req.query.include as string[];

  let queryParsed;

  // if (includes) {
  //   queryParsed = includes
  //     .map(include => {
  //       if (include === 'Tarif') return { model: Tarif };
  //       if (include === 'Dev') return { model: ClientDev };
  //       if (include === 'DailyData') return { model: DailyData };
  //       if (include === 'Options')
  //         return { model: ClientOption, attributes: ['name', 'isDeprecated'] };
  //     })
  //     .filter(item => item !== undefined);
  // }
  const found = (await model.findAll({ include: queryParsed })) ?? {};
  res.status(200).send(found).end();
}

async function getById(req: Request, res: Response) {
  const id = getIdParam(req);

  // const includes = req.query.include as string[];
  //
  let queryParsed;
  //
  // if (includes) {
  //   queryParsed = includes
  //     .map(include => {
  //       if (include === 'Tarif') return { model: Tarif };
  //       if (include === 'Dev') return { model: ClientDev };
  //       if (include === 'DailyData') return { model: DailyData };
  //       if (include === 'Options')
  //         return { model: ClientOption, attributes: ['id', 'name', 'isDeprecated'] };
  //     })
  //     .filter(item => item !== undefined);
  // }

  if (!id) {
    res.status(400).send({
      message: 'Bad request: proper ID should be provided as parameter',
    });
    return;
  }

  const found =
    (await model.findOne({
      where: {
        clientId: { [Op.eq]: id },
      },
      include: queryParsed,
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
    res.status(201).send({ message: 'Created' }).end();
  } catch (e) {
    if (e instanceof UniqueConstraintError) {
      res.status(409).send(e.parent.message).end();
    }
  }
}

async function remove(req: Request, res: Response) {
  const id = getIdParam(req);

  const count = await model.count({
    where: { clientId: { [Op.eq]: id } },
  });
  if (count === 0) {
    res.status(404).send({ message: 'Record not found' }).end();
    return;
  }

  await model.destroy({
    where: {
      clientId: { [Op.eq]: id },
    },
  });

  res.status(200).send({ message: 'Deleted' }).end();
}

async function update(req: Request, res: Response) {
  const id = getIdParam(req);
  const { body }: { body: Partial<unknown> } = req;
  //
  // const client = (await model.findOne({
  //   where: { clientId: { [Op.eq]: id } },
  // })) as Client;
  //
  // if (body.id) {
  //   res
  //     .status(400)
  //     .send({ message: `Remove id from request body, clientId must be set instead` })
  //     .end();
  //   return;
  // }
  //
  // if (client === null) {
  //   res
  //     .status(404)
  //     .send({ message: `Found no records for clientId ${id}` })
  //     .end();
  //   return;
  // }
  //
  // if (body.clientOptions && body.clientOptions?.length !== 0) {
  //   const allOptions: number[] = (
  //     (await ClientOption.findAll({
  //       attributes: ['id'],
  //     })) as ClientOption[]
  //   ).map(option => option.id);
  //
  //   const fromUpdate: number[] = body.clientOptions
  //     .map(option => option.id)
  //     .filter(f => f !== undefined);
  //
  //   const alreadyPresent = (
  //     (await RelClientOptions.findAll({
  //       where: { clientId: body.clientId },
  //     })) as RelClientOptions[]
  //   ).map(option => option.optionId);
  //
  //   const optionsToAdd = fromUpdate
  //     .map(optionId => {
  //       if (!alreadyPresent.includes(optionId)) {
  //         return { optionId, clientId: body.clientId! };
  //       }
  //
  //       return null;
  //     })
  //     .filter(f => f) as Partial<RelClientOptions>[];
  //
  //   const optionsToDrop = allOptions
  //     .map(optionId => {
  //       if (!fromUpdate.includes(optionId)) {
  //         return optionId;
  //       }
  //     })
  //     .filter(f => f);
  //
  //   await RelClientOptions.destroy({
  //     where: {
  //       clientId: { [Op.eq]: body.clientId },
  //       optionId: { [Op.in]: optionsToDrop },
  //     },
  //   });
  //
  //   await RelClientOptions.bulkCreate(optionsToAdd);
  // }

  const [rows] = await model.update(body, {
    where: {
      clientId: { [Op.eq]: id },
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

  await model.restore({ where: { id: { [Op.eq]: id } } });

  res.status(200).send({ message: 'Restored' }).end();
}

export default { getById, getAll, create, update, remove, restore };

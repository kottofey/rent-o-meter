import {
  BelongsTo,
  Model,
  Table,
  Column,
  NotNull,
  ForeignKey,
  Scopes,
  HasOne,
} from 'sequelize-typescript';
import { DataTypes, Op } from 'sequelize';
import chalk from 'chalk';

import { dayjs } from '@/helpers';
import { Agreement, Bill } from '@/models';

@Scopes(() => ({
  'counter:byPeriod'({ start, end }: { start: number; end: number }) {
    return {
      where: {
        month: {
          [Op.gte]: dayjs(start).startOf('month').toDate(),
          [Op.lt]: dayjs(end).endOf('month').toDate(),
        },
      },
    };
  },
  'counter:byMonth'(month: number) {
    return {
      where: {
        month: {
          [Op.eq]: dayjs(month).toDate(),
        },
      },
    };
  },
  'counter:byAgreementId'(agreementId: number) {
    return {
      where: {
        agreementId,
      },
    };
  },
}))
@Table({ paranoid: true })
export default class Counters extends Model {
  @NotNull
  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  set month(date: number) {
    this.setDataValue('month', dayjs(date).startOf('month').toDate());
  }
  get month() {
    const raw: string = this.getDataValue('month') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @NotNull
  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  set date_start(date: number) {
    this.setDataValue('date_start', dayjs(date).toDate());
  }
  get date_start() {
    const raw: string = this.getDataValue('date_start') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @NotNull
  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  set date_end(date: number) {
    this.setDataValue('date_end', dayjs(date).toDate());
  }
  get date_end() {
    const raw: string = this.getDataValue('date_end') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare counter_water: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare counter_electricity: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare counter_prev_water: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare counter_prev_electricity: number;

  @Column(DataTypes.TEXT)
  declare comment: string;

  // -----------------------------------------------------------------------------
  // Virtual fields
  // -----------------------------------------------------------------------------

  @Column({ type: DataTypes.VIRTUAL })
  get water_diff() {
    return this.counter_water - this.counter_prev_water;
  }
  set water_diff(value) {
    throw new Error('Do not try to set the `water_diff` value!');
  }

  @Column({ type: DataTypes.VIRTUAL })
  get electricity_diff() {
    return this.counter_electricity - this.counter_prev_electricity;
  }
  set electricity_diff(value) {
    throw new Error('Do not try to set the `electricity_diff` value!');
  }

  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------
  @NotNull
  @ForeignKey(() => Agreement)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare agreementId: number;

  @BelongsTo(() => Agreement, { onDelete: 'Restrict' })
  agreement: Agreement;

  @HasOne(() => Bill, { onDelete: 'Restrict' })
  bill: Bill;
}

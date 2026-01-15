import {
  BelongsTo,
  Model,
  Table,
  Column,
  NotNull,
  Default,
  ForeignKey,
  Scopes,
  DefaultScope,
} from 'sequelize-typescript';
import { DataTypes, Op } from 'sequelize';
import { dayjs } from '@/helpers';
import { Agreement, Rentee, Tarif } from '@/models';

@Scopes(() => ({
  withRentees() {
    return {
      include: {
        model: Agreement,
        include: [
          {
            model: Rentee,
          },
        ],
      },
    };
  },
  isDebt() {
    return {
      where: {
        status: {
          [Op.eq]: false,
        },
      },
    };
  },
  withPeriod({ start, end }: { start: number; end: number }) {
    return {
      where: {
        month: {
          [Op.gte]: dayjs(start).startOf('month').toDate(),
          [Op.lt]: dayjs(end).endOf('month').toDate(),
        },
      },
    };
  },
  byAgreement({ agreementId }: { agreementId: number }) {
    return {
      where: {
        agreementId: {
          [Op.eq]: agreementId,
        },
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
  @Default(true)
  @Column({ type: DataTypes.BOOLEAN, allowNull: false })
  declare status: boolean;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare counter_water: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare counter_electricity: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 })
  declare penalty: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 })
  declare debt: number;

  @Column(DataTypes.TEXT)
  declare comment: string;

  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------
  @NotNull
  @ForeignKey(() => Tarif)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare tarifId: number;

  @BelongsTo(() => Tarif, { onDelete: 'CASCADE' })
  tarif: Tarif;

  @NotNull
  @ForeignKey(() => Agreement)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare agreementId: number;

  @BelongsTo(() => Agreement, { onDelete: 'CASCADE' })
  agreement: Agreement;
}

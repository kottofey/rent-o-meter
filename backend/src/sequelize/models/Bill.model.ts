import { Model, Table, Column, NotNull, ForeignKey, BelongsTo, Scopes } from 'sequelize-typescript';
import { DataTypes, Op } from 'sequelize';

import { Agreement, Counter, Tarif } from '@/models';
import { dayjs } from '@/helpers';

@Scopes(() => ({
  'bills:isDebt'() {
    return {
      where: {
        status: {
          [Op.eq]: false,
        },
      },
    };
  },
}))
@Table({ paranoid: true })
export default class Bill extends Model {
  @NotNull
  @Column({ type: DataTypes.BOOLEAN, allowNull: false })
  declare status: boolean;

  @NotNull
  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  set bill_date(date: number) {
    this.setDataValue('bill_date', dayjs(date).toDate());
  }
  get bill_date() {
    const raw: string = this.getDataValue('bill_date') as string;
    return dayjs(raw).toDate().valueOf();
  }

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
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare ammount: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare extra_ammount: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 })
  declare ammount_paid: number;

  @Column(DataTypes.TEXT)
  declare comment: string;

  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------
  @NotNull
  @ForeignKey(() => Agreement)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare agreementId: number;

  @BelongsTo(() => Agreement, { onDelete: 'Restrict' })
  agreement: Agreement;

  @NotNull
  @ForeignKey(() => Counter)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare counterId: number;

  @BelongsTo(() => Counter, { onDelete: 'Restrict' })
  counter: Counter;

  @NotNull
  @ForeignKey(() => Tarif)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare tarifId: number;

  @BelongsTo(() => Tarif, { onDelete: 'Restrict' })
  tarif: Tarif;
}

import {
  Model,
  Table,
  Column,
  NotNull,
  ForeignKey,
  BelongsTo,
  Scopes,
  BelongsToMany,
} from 'sequelize-typescript';
import { DataTypes, Op } from 'sequelize';

import { Agreement, Counter, Tarif, RelBillTarifs } from '@/models';
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
  @Column({ type: DataTypes.DECIMAL(8, 2), allowNull: false })
  set ammount(value: number) {
    this.setDataValue('ammount', value);
  }
  get ammount() {
    const raw: string = this.getDataValue('ammount') as string;
    return parseFloat(raw);
  }

  @NotNull
  @Column({ type: DataTypes.DECIMAL(8, 2), allowNull: false })
  set extra_ammount(value: number | null) {
    this.setDataValue('extra_ammount', value ?? 0);
  }
  get extra_ammount() {
    const raw: string = this.getDataValue('extra_ammount') as string;
    return parseFloat(raw);
  }

  @Column({ type: DataTypes.DECIMAL(8, 2), defaultValue: 0 })
  set ammount_paid(value: number) {
    this.setDataValue('ammount_paid', value);
  }
  get ammount_paid() {
    const raw: string = this.getDataValue('ammount_paid') as string;
    return parseFloat(raw);
  }

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

  @BelongsToMany(() => Tarif, () => RelBillTarifs)
  tarifs: (Tarif & { RelBillCounters: RelBillTarifs })[];
}

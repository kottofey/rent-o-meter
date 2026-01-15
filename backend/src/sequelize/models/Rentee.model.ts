import {
  Model,
  Table,
  Column,
  NotNull,
  Default,
  HasMany,
  Scopes,
  DefaultScope,
} from 'sequelize-typescript';
import { DataTypes, Op } from 'sequelize';

import Agreement from './Agreement.model.ts';

import { dayjs } from '@/helpers';

@DefaultScope(() => ({
  include: {
    model: Agreement,
  },
}))
@Scopes(() => ({
  withActiveAgreementsOnly() {
    console.log('withActiveAgreementsOnly');
    return {
      include: {
        model: Agreement,
        where: {
          status: {
            [Op.eq]: true,
          },
        },
      },
    };
  },
}))
@Table({ paranoid: true })
export default class Rentee extends Model {
  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare surname: string;

  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare firstname: string;

  @Column({ type: DataTypes.STRING })
  declare patronymic: string;

  @Column(DataTypes.TEXT)
  declare comment: string;

  @NotNull
  @Default(true)
  @Column({ type: DataTypes.BOOLEAN, allowNull: false })
  declare status: boolean;

  @NotNull
  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  set date_start(date: number) {
    this.setDataValue('date_start', dayjs(date).toDate());
  }
  get date_start() {
    const raw: string = this.getDataValue('date_start') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @Column({ type: DataTypes.DATEONLY })
  set date_end(date: number | null) {
    if (date) {
      this.setDataValue('date_end', dayjs(date).toDate());
    }
  }
  get date_end() {
    const raw: string = this.getDataValue('date_end') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @Column({ type: DataTypes.STRING, defaultValue: '' })
  declare phone: string;

  @Column({ type: DataTypes.STRING, defaultValue: '' })
  declare email: string;

  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------
  @HasMany(() => Agreement, { onDelete: 'CASCADE' })
  agreements: Agreement[];

  // -----------------------------------------------------------------------------
  // Virtuals
  // -----------------------------------------------------------------------------
  @Column({ type: DataTypes.VIRTUAL })
  get fullName() {
    return `${this.surname} ${this.firstname} ${this.patronymic}`;
  }
  set fullName(value) {
    throw new Error('Do not try to set the `renteeFullName` value!');
  }
}

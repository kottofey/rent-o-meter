import {
  BelongsTo,
  Model,
  Table,
  Column,
  NotNull,
  Default,
  ForeignKey,
  HasMany,
  Scopes,
} from 'sequelize-typescript';
import { DataTypes, Op } from 'sequelize';
import { dayjs } from '@/helpers';
import { PayMonth, Rentee } from '@/models';

@Scopes(() => ({
  withPaymonth() {
    return {
      include: [PayMonth],
    };
  },
  isDebt() {
    return {
      include: {
        model: PayMonth,
        where: {
          status: {
            [Op.eq]: false,
          },
        },
      },
    };
  },
}))
@Table({ paranoid: true })
export default class Agreement extends Model {
  @NotNull
  @ForeignKey(() => Rentee)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare renteeId: number;

  @BelongsTo(() => Rentee, { onDelete: 'CASCADE' })
  rentee: Rentee;

  @HasMany(() => PayMonth, { onDelete: 'CASCADE' })
  pay_months: PayMonth[];

  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare name: string;

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

  @NotNull
  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  set date_end(date: number) {
    this.setDataValue('date_end', dayjs(date).toDate());
  }
  get date_end() {
    const raw: string = this.getDataValue('date_end') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @Column(DataTypes.TEXT)
  declare comment: string;
}

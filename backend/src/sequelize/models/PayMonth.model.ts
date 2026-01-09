import {
  BelongsTo,
  Model,
  Table,
  Column,
  NotNull,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { dayjs } from '@/helpers';
import { Agreement, Tarif } from '@/models';

@Table({ paranoid: true })
export default class PayMonth extends Model {
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
  @ForeignKey(() => Agreement)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare agreementId: number;

  @BelongsTo(() => Agreement, { onDelete: 'CASCADE' })
  agreement: Agreement;

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
  @ForeignKey(() => Tarif)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare tarifId: number;

  @BelongsTo(() => Tarif, { onDelete: 'CASCADE' })
  tarif: Tarif;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 })
  declare penalty: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 })
  declare debt: number;

  @Column(DataTypes.TEXT)
  declare comment: string;
}

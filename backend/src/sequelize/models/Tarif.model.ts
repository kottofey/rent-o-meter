import { Model, Table, Column, NotNull, HasMany } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { PayMonth } from '@/models';

@Table({ paranoid: true })
export default class Tarif extends Model {
  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare water: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare electricity: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare heat: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare gas: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare renovation: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare tko: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare managing_company: string;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare domofon: string;

  @Column(DataTypes.TEXT)
  declare comment: string;

  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------

  @HasMany(() => PayMonth, { onDelete: 'CASCADE' })
  payMonths: PayMonth[];
}

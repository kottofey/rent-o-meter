import { Model, Table, Column, NotNull, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ paranoid: false, timestamps: false })
export default class Seeder extends Model {
  @NotNull
  @PrimaryKey
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare filename: string;

  @NotNull
  @Column({ type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW })
  declare executedAt: string;
}

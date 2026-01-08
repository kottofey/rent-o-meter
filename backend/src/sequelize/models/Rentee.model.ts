import { Model, Table, Column, NotNull, Default } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { dayjs } from '@/helpers';

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
  @Default(true)
  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  set date_start(date: number) {
    this.setDataValue('date_start', dayjs(date).toDate());
  }
  get date_start() {
    const raw: string = this.getDataValue('date_start') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @Default(true)
  @Column({ type: DataTypes.DATEONLY })
  set date_end(date: number) {
    this.setDataValue('date_end', dayjs(date).toDate());
  }
  get date_end() {
    const raw: string = this.getDataValue('date_end') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @Column({ type: DataTypes.STRING, defaultValue: '' })
  declare phone: string;

  @Column({ type: DataTypes.STRING, defaultValue: '' })
  declare email: string;
}

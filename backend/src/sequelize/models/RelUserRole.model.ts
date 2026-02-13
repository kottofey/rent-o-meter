import { Model, Table, Column, ForeignKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { Role, User } from '@/models';

@Table({ paranoid: false, timestamps: false, tableName: 'RelUserRoles' })
export default class RelUserRole extends Model {
  @ForeignKey(() => Role)
  @Column(DataTypes.INTEGER)
  declare role_id: number;

  @ForeignKey(() => User)
  @Column(DataTypes.INTEGER)
  declare user_id: number;
}

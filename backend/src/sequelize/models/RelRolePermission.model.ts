import { Model, Table, Column, ForeignKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { Role, Permission } from '@/models';

@Table({ paranoid: false, timestamps: false, tableName: 'RelRolePermissions' })
export default class RelRolePermission extends Model {
  @ForeignKey(() => Role)
  @Column(DataTypes.INTEGER)
  declare role_id: number;

  @ForeignKey(() => Permission)
  @Column(DataTypes.INTEGER)
  declare permission_id: number;
}

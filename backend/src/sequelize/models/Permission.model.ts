import { Model, Table, Column, NotNull, Default, BelongsToMany } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { RelRolePermission, Role } from '@/models';

@Table({ paranoid: true })
export default class Permission extends Model {
  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataTypes.STRING })
  declare description: string;

  @NotNull
  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Например: agreements, rentees, tariffs, bills',
  })
  declare resource: string;

  @NotNull
  @Column({
    type: DataTypes.ENUM('create', 'read', 'update', 'delete', 'manage'),
    allowNull: false,
    comment: 'create, read, update, delete, manage',
  })
  declare action: string;

  @NotNull
  @Default(true)
  @Column({ type: DataTypes.BOOLEAN, allowNull: false })
  declare status: boolean;

  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------

  @BelongsToMany(() => Role, () => RelRolePermission)
  roles: (Role & { RelRolePermissions: RelRolePermission })[];
}

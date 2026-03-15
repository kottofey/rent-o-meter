import { Model, Table, Column, NotNull, Default, BelongsToMany } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { User, RelUserRole, Permission, RelRolePermission } from '@/models';

@Table({ paranoid: false, timestamps: false })
export default class Role extends Model {
  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataTypes.STRING })
  declare description: string;

  @NotNull
  @Default(true)
  @Column({ type: DataTypes.BOOLEAN, allowNull: false })
  declare status: boolean;

  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------

  @BelongsToMany(() => Permission, () => RelRolePermission)
  declare permissions: (Permission & { RelRolePermissions: RelRolePermission })[];

  @BelongsToMany(() => User, () => RelUserRole)
  declare users: (User & { RelUserRoles: RelUserRole })[];
}

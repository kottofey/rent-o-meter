import {
  Model,
  Table,
  Column,
  NotNull,
  Default,
  HasMany,
  BelongsTo,
  BelongsToMany,
  ForeignKey,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { RefreshToken, RelUserRole, Rentee, Role } from '@/models';
import { dayjs } from '@/helpers';

@Table({ paranoid: true })
export default class User extends Model {
  @ForeignKey(() => Rentee)
  @Column({ type: DataTypes.INTEGER })
  declare rentee_id: number;

  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare surname: string;

  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare firstname: string;

  @Column({ type: DataTypes.STRING })
  declare patronymic: string;

  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } })
  declare email: string;

  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare password: string;

  @NotNull
  @Default(true)
  @Column({ type: DataTypes.BOOLEAN, allowNull: false })
  declare status: boolean;

  @Column({ type: DataTypes.DATE })
  set last_login(date: number) {
    this.setDataValue('last_login', dayjs(date).toDate());
  }
  get last_login() {
    const raw: string = this.getDataValue('last_login') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @Column(DataTypes.TEXT)
  declare comment: string;
  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------

  @HasMany(() => RefreshToken)
  refreshTokens: RefreshToken[];

  @BelongsTo(() => Rentee)
  rentee: Rentee;

  @BelongsToMany(() => Role, () => RelUserRole)
  roles: (Role & { RelUserRoles: RelUserRole })[];

  // -----------------------------------------------------------------------------
  // Virtuals
  // -----------------------------------------------------------------------------
  @Column({ type: DataTypes.VIRTUAL })
  get full_name() {
    return `${this.surname} ${this.firstname} ${this.patronymic}`;
  }
  set full_name(value) {
    throw new Error('Do not try to set the `full_name` value!');
  }
}

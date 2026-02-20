import {
  Model,
  Table,
  Column,
  NotNull,
  BelongsTo,
  ForeignKey,
  Default,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { User } from '@/models';
import { dayjs } from '@/helpers';

@Table({ paranoid: true })
export default class RefreshToken extends Model {
  @NotNull
  @ForeignKey(() => User)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare user_id: number;

  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false, unique: true })
  declare token_hash: string;

  @NotNull
  @Column({ type: DataTypes.DATE, allowNull: false })
  set expires_at(date: number) {
    this.setDataValue('expires_at', dayjs().add(date, 's').toDate());
  }
  get expires_at() {
    const raw: string = this.getDataValue('expires_at') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @Default(false)
  @Column({ type: DataTypes.BOOLEAN })
  declare is_revoked: boolean;

  @Column({ type: DataTypes.STRING })
  declare user_agent: string;

  @Column({ type: DataTypes.STRING })
  declare ip: string;

  @Column({ type: DataTypes.INTEGER })
  declare device_id: number;

  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------

  @BelongsTo(() => User)
  user: User;

  // -----------------------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------------------
  isRevoked() {
    return this.is_revoked;
  }

  isExpired() {
    return dayjs().isAfter(dayjs(this.expires_at));
  }
}

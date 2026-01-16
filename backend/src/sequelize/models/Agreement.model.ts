import {
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  NotNull,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { DataTypes, Op } from 'sequelize';

import { dayjs } from '@/helpers';
import { Rentee } from '@/models';

@Scopes(() => ({
  isStatusActive() {
    return {
      where: {
        status: {
          [Op.eq]: true,
        },
      },
    };
  },
  isNotExpired() {
    return {
      where: {
        date_end: {
          [Op.gte]: dayjs().toDate(),
        },
      },
    };
  },
  isExpired() {
    return {
      where: {
        date_end: {
          [Op.lt]: dayjs().toDate(),
        },
      },
    };
  },
  isExpiredAndActive() {
    return {
      where: {
        date_end: {
          [Op.lt]: dayjs().toDate(),
        },
        status: {
          [Op.eq]: true,
        },
      },
    };
  },
}))
@Table({ paranoid: true })
export default class Agreement extends Model {
  @NotNull
  @Column({ type: DataTypes.STRING, allowNull: false })
  declare name: string;

  @NotNull
  @Default(true)
  @Column({ type: DataTypes.BOOLEAN, allowNull: false })
  declare status: boolean;

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
  set date_end(date: number | null) {
    if (date) {
      this.setDataValue('date_end', dayjs(date).toDate());
    }
  }
  get date_end() {
    const raw: string = this.getDataValue('date_end') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @Column(DataTypes.TEXT)
  declare comment: string;

  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------
  @NotNull
  @ForeignKey(() => Rentee)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare renteeId: number;

  @BelongsTo(() => Rentee, { onDelete: 'CASCADE' })
  rentee: Rentee;

  // -----------------------------------------------------------------------------
  // Virtual fields
  // -----------------------------------------------------------------------------
}

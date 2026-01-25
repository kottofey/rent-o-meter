import {
  BeforeSave,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  NotNull,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { DataTypes, Op } from 'sequelize';

import { dayjs } from '@/helpers';
import { Bill, Counter, Rentee } from '@/models';

@Scopes(() => ({
  'agreements:activeOnly'() {
    return {
      where: {
        status: {
          [Op.eq]: true,
        },
      },
    };
  },
  'agreements:isNotExpired'() {
    return {
      where: {
        date_end: {
          [Op.gte]: dayjs().toDate(),
        },
      },
    };
  },
  'agreements:isExpired'() {
    return {
      where: {
        date_end: {
          [Op.lt]: dayjs().toDate(),
        },
      },
    };
  },
  'agreements:isExpiredAndActive'() {
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
  'agreements:byRentee'(renteeId: number) {
    return {
      where: {
        renteeId: {
          [Op.eq]: renteeId,
        },
      },
    };
  },
  'agreements:withDeleted'() {
    return {
      paranoid: false,
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

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 })
  declare debt: number;

  @NotNull
  @Column({ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 })
  declare penalty: number;

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

  @HasMany(() => Counter, { onDelete: 'CASCADE' })
  counters: Counter[];

  @HasMany(() => Bill, { onDelete: 'CASCADE' })
  bills: Bill[];

  // -----------------------------------------------------------------------------
  // Virtual fields
  // -----------------------------------------------------------------------------

  // -----------------------------------------------------------------------------
  // Before Save
  // -----------------------------------------------------------------------------
  @BeforeSave
  static async ensureSingleActiveAgreement(instance: Agreement) {
    if (!instance.status) return;

    const existing = await Agreement.findOne({
      where: {
        renteeId: instance.renteeId,
        status: true,
        // исключаем текущую запись при обновлении
        ...(instance.id ? { id: { [Op.ne]: instance.id as number } } : {}),
        // id: {
        //   [Op.ne]: instance.id as number,
        // },
      },
      include: [Rentee],
    });

    if (existing) {
      const jsonAgreement: Agreement = existing.toJSON();
      throw new Error(
        `У арендатора ${jsonAgreement.rentee.fullName} (id: ${jsonAgreement.renteeId.toString()}) уже есть активный договор (${jsonAgreement.name}). Нельзя создать второй активный договор.`,
      );
    }
  }
}

import { Model, Table, Column, NotNull, ForeignKey, BelongsTo, Scopes } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

import { Agreement, Bill } from '@/models';
import { dayjs } from '@/helpers';

@Scopes(() => ({
  'payment:byBill'(billId: number | null) {
    if (billId === null) {
      return {};
    } else {
      return {
        include: {
          model: Bill,
          where: {
            id: billId,
          },
        },
      };
    }
  },
  'payment:byRentee'(renteeId: number | null) {
    if (renteeId === null) {
      return {};
    } else {
      return {
        where: {
          '$bill.agreement.renteeId$': renteeId,
        },
        include: [
          {
            model: Bill,
            include: [
              {
                model: Agreement,
                required: false,
                where: {
                  renteeId,
                },
              },
            ],
          },
        ],
      };
    }
  },
}))
@Table({ paranoid: true })
export default class Payment extends Model {
  @NotNull
  @Column({ type: DataTypes.DATEONLY, allowNull: false })
  set date(date: number) {
    this.setDataValue('date', dayjs(date).toDate());
  }
  get date() {
    const raw: string = this.getDataValue('date') as string;
    return dayjs(raw).toDate().valueOf();
  }

  @NotNull
  @Column({ type: DataTypes.DECIMAL(8, 2), allowNull: false })
  set ammount(value: number) {
    this.setDataValue('ammount', value);
  }
  get ammount() {
    const raw: string = this.getDataValue('ammount') as string;
    return parseFloat(raw);
  }

  @Column(DataTypes.TEXT)
  declare comment: string;

  // -----------------------------------------------------------------------------
  // Relations
  // -----------------------------------------------------------------------------
  @NotNull
  @ForeignKey(() => Bill)
  @Column({ type: DataTypes.INTEGER, allowNull: false })
  declare bill_id: number;

  @BelongsTo(() => Bill, { onDelete: 'Restrict' })
  declare bill: Bill;
}

import { Agreement } from '@/models';

export default function calculateDebt(agreement: Agreement): number {
  const totalAmmount = agreement.bills.reduce(
    (acc, bill) => acc + bill.ammount + (bill.extra_ammount ?? 0),
    0,
  );

  const totalPaid = agreement.bills.reduce((acc, bill) => acc + bill.ammount_paid, 0);

  // console.log(
  //   'Total ammount:',
  //   totalAmmount,
  //   'total paid:',
  //   totalPaid,
  //   'debt:',
  //   totalAmmount - totalPaid,
  // );
  return totalAmmount - totalPaid;
}

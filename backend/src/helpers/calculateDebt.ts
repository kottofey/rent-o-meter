import { IAgreement } from '@/entities/agreement';

export function calculateDebt(agreement: IAgreement): number {
  const totalAmmount =
    agreement.bills.reduce(
      (acc, bill) => acc + bill.ammount + bill.extra_ammount,
      0,
    ) ?? NaN;

  const totalPaid =
    agreement.bills.reduce((acc, bill) => acc + bill.ammount_paid, 0) ?? NaN;

  console.log(
    'Total ammount:',
    totalAmmount,
    'total paid:',
    totalPaid,
    'debt:',
    totalAmmount - totalPaid,
  );
  return totalAmmount - totalPaid;
}

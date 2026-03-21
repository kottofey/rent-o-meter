import { Agreement } from '@/models';

export default function calculateDebt(agreement: Agreement): number {
  const totalAmmount = agreement.bills.reduce(
    (acc, bill) => acc + bill.ammount + (bill.extra_ammount ?? 0),
    0,
  );
  const totalPaid = agreement.bills.reduce((acc, bill) => {
    return acc + bill.payments.reduce((acc, p) => acc + p.ammount, 0);
  }, 0);

  return totalAmmount - totalPaid;
}

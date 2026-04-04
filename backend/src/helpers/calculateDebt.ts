import { Agreement } from '@/models';

export default function calculateDebt(agreement: Agreement): number {
  const totalAmmount = agreement.bills.reduce((acc, bill) => {
    // console.log('tot', bill.ammount.toString(), bill.extra_ammount?.toString());
    return acc + bill.ammount + (bill.extra_ammount ?? 0);
  }, 0);

  const totalPaid = agreement.bills.reduce((acc, bill) => {
    // console.log('tot', bill.ammount.toString(), bill.extra_ammount?.toString());
    console.log('p', bill.payments);
    return acc + bill.payments.reduce((acc, p) => acc + p.ammount, 0);
  }, 0);

  console.log('ret:', totalAmmount, totalPaid);
  return totalAmmount - totalPaid;
}

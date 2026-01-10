import { IRentee } from '@/entities/rentee/@x/agreement';
import { IPayMonth } from '@/entities/payMonth/@x/agreement';

export interface IAgreement {
  id: number;
  renteeId: number;
  rentee: IRentee;

  pay_months: IPayMonth[];

  name: string;
  status: boolean;
  date_start: number;
  date_end: number;
  comment: string;
}

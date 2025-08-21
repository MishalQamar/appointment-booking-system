import { MyBig } from '../lib/big';

export const toPenny = (amount: number) =>
  new MyBig(amount).mul(100).round(2).toNumber();

export const fromPenny = (amount: number) =>
  new MyBig(amount).div(100).round(2).toNumber();

export const toCurrencyFromPenny = (
  amount: number,
  currency?: string
) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency ?? 'GBP',
  }).format(fromPenny(amount));

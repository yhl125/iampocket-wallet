import { formatUnits } from 'viem';

export function erc20BalanceToReadable(
  balance: string,
  decimals: number,
): string {
  if (decimals === 0) return balance;
  const formatedUnits = formatUnits(BigInt(balance), decimals);
  const int = formatedUnits.split('.')[0];
  if (formatedUnits.split('.')[1] !== undefined) {
    const fiveDecimals = formatedUnits.split('.')[1].slice(0, 5);
    return `${int}.${fiveDecimals}`;
  } else {
    return int;
  }
}

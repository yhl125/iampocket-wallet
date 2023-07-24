import { ethers } from "ethers";

export function erc20BalanceToReadable(balance: string, decimals: number) {
  const formatedUnits = ethers.utils.formatUnits(balance, decimals)
  const int = formatedUnits.split('.')[0]
  const fiveDecimals = formatedUnits.split('.')[1].slice(0, 5)
  return `${int}.${fiveDecimals}`
}
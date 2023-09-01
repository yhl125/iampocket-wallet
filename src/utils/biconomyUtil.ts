export function biconomyPaymasterOf(chainId: number) {
  switch (chainId) {
    case 59140:
      return process.env.NEXT_PUBLIC_BICONOMY_LINEA_GOERLI_PAYMASTER!;
    case 1442:
      return process.env.NEXT_PUBLIC_BICONOMY_POLYGON_ZKEVM_TESTNET_PAYMASTER!;
    default:
      return process.env.NEXT_PUBLIC_BICONOMY_LINEA_GOERLI_PAYMASTER!;
  }
}

import { EIP155_CHAINS } from '@/data/EIP155Data';
import { ethers } from 'ethers';

export function providerOf(chainId: number) {
  const rpc = EIP155_CHAINS[`eip155:${chainId}`].rpc;
  if (!rpc) {
    throw new Error(`No RPC endpoint for chainId ${chainId}`);
  }
  return new ethers.providers.JsonRpcProvider(rpc);
}

export function projectIdOf(chainId: number) {
  switch (chainId) {
    case 5:
      return process.env.NEXT_PUBLIC_GOERLI_PROJECT_ID!;
    case 80001:
      return process.env.NEXT_PUBLIC_MUMBAI_PROJECT_ID!;
    case 421613:
      return process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_PROJECT_ID!;
    case 420:
      return process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_PROJECT_ID!;
    case 43113:
      return process.env.NEXT_PUBLIC_AVALANCHE_FUJI_PROJECT_ID!;
    default:
      return process.env.NEXT_PUBLIC_GOERLI_PROJECT_ID!;
  }
}

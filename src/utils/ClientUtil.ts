import { EIP155_CHAINS } from '@/data/EIP155Data';
import { createPublicClient, http } from 'viem';

import * as chains from 'viem/chains';

export function getChain(chainId: number) {
  for (const chain of Object.values(chains)) {
    if ('id' in chain) {
      if (chain.id === chainId) {
        return chain;
      }
    }
  }
  throw new Error(`Chain with id ${chainId} not found`);
}

export function publicClientOf(chainId: number) {
  const rpc = EIP155_CHAINS[`eip155:${chainId}`].rpc;
  if (!rpc) {
    throw new Error(`No RPC endpoint for chainId ${chainId}`);
  }
  return createPublicClient({
    chain: getChain(chainId),
    transport: http(rpc),
  });
}
export function projectIdOf(chainId: number) {
  switch (chainId) {
    // Mainnet
    case 10:
      return process.env.NEXT_PUBLIC_OPTIMISM_PROJECT_ID!;
    case 42161:
      return process.env.NEXT_PUBLIC_ARBITRUM_PROJECT_ID!;
    // Testnet
    case 5:
      return process.env.NEXT_PUBLIC_GOERLI_PROJECT_ID!;
    case 11155111:
      return process.env.NEXT_PUBLIC_SEPOLIA_PROJECT_ID!;
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

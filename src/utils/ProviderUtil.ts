import { ethers } from 'ethers';

export function providerOf(chainId: number) {
  switch (chainId) {
    case 80001:
      return new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_MUMBAI_RPC);
      case 420:
      return new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_RPC);
      case 421613:
      return new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_RPC);
    default:
      return new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_MUMBAI_RPC);
  }
}

export function projectIdOf(chainId: number) {
  switch (chainId) {
    case 80001:
      return process.env.NEXT_PUBLIC_MUMBAI_PROJECT_ID!;
      case 420:
      return process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_PROJCET_ID!;
      case 421613:
      return process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_PROJCET_ID!;
    default:
      return process.env.NEXT_PUBLIC_MUMBAI_RPC!;
  }
}
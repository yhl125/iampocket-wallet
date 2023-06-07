import { ethers } from 'ethers';

export function providerOf(chainId: number) {
  switch (chainId) {
    case 80001:
      return new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_MUMBAI_RPC);
    default:
      return new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_MUMBAI_RPC);
  }
}

export function projectIdOf(chainId: number) {
  switch (chainId) {
    case 80001:
      return process.env.NEXT_PUBLIC_MUMBAI_PROJECT_ID!;
    default:
      return process.env.NEXT_PUBLIC_MUMBAI_PROJECT_ID!;
  }
}
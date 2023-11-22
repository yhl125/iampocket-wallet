import { PKPViemAccount } from 'pkp-viem';
import { SessionSigs } from '@lit-protocol/types';
import { getChain } from './ClientUtil';
import { WalletClient, createWalletClient, http } from 'viem';

export function createPKPViemAccount(
  pkpPubKey: string,
  sessionSigs: SessionSigs,
): PKPViemAccount {
  const account: PKPViemAccount = new PKPViemAccount({
    controllerSessionSigs: sessionSigs,
    pkpPubKey,
  });
  return account;
}
export function createPkpViemWalletClient(
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number = 80001,
): WalletClient {
  const pkpViemAccount: PKPViemAccount = createPKPViemAccount(
    pkpPubKey,
    sessionSigs,
  );
  const pkpViemWalletClient = createWalletClient({
    account: pkpViemAccount,
    transport: http(),
    chain: getChain(chainId),
  });
  return pkpViemWalletClient;
}
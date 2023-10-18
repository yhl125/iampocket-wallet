import {
  ECDSAProvider,
} from '@zerodev/sdk';
import { SupportedGasToken } from '@zerodev/sdk/dist/types';
import { SessionSigs } from '@lit-protocol/types';
import { getChain, projectIdOf } from './ClientUtil';
import AddressStore from '@/store/AddressStore';
import {
  PKPViemAccount,
  convertAccountToSmartAccountSigner,
} from '@altpd13/pkp-viem';
import { createWalletClient, http } from 'viem';
import { WalletClient } from 'viem';

/**
 * Utilities
 */

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
export async function createOrRestoreERC4337Wallet(
  pkpPubKey: string,
  sessionSigs: SessionSigs,
) {
  const [zeroDevWallet, eoaPkpViemWallet] = await Promise.all([
    zeroDevSigner(pkpPubKey, sessionSigs),
    createPkpViemWalletClient(pkpPubKey, sessionSigs),
  ]);
  const [zeroDevAddress, eoaPkpViemAddress] = await Promise.all([
    zeroDevWallet.getAddress(),
    eoaPkpViemWallet.account!.address,
  ]);
  AddressStore.setZeroDevAddress(zeroDevAddress);
  AddressStore.setPkpViemAddress(eoaPkpViemAddress);

  return zeroDevAddress;
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

export async function zeroDevSigner(
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number = 80001,
) {
  const account = createPKPViemAccount(pkpPubKey, sessionSigs);

  const provider = await ECDSAProvider.init({
    projectId: projectIdOf(chainId),
    owner: convertAccountToSmartAccountSigner(account),
  });

  return provider;
}

export async function zeroDevSignerWithERC20Gas(
  gasToken: SupportedGasToken,
  pkpPubKey: string,
  sessionSigs: SessionSigs,
  chainId: number = 80001,
) {
  const account = createPKPViemAccount(pkpPubKey, sessionSigs);
  const providerWithERC20Gas = await ECDSAProvider.init({
    projectId: projectIdOf(chainId),
    owner: convertAccountToSmartAccountSigner(account),
    opts: {
      paymasterConfig: {
        policy: 'TOKEN_PAYMASTER',
        gasToken: gasToken,
      },
    },
  });
  return providerWithERC20Gas;
}

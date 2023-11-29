import {
  ECDSAProvider,
  SupportedGasToken,
  convertWalletClientToAccountSigner,
} from '@zerodev/sdk';
import { SessionSigs } from '@lit-protocol/types';
import { projectIdOf } from './ClientUtil';
import AddressStore from '@/store/AddressStore';
import { PKPViemAccount } from 'pkp-viem';
import {
  createPKPViemAccount,
  createPkpViemWalletClient,
} from './EOAWalletUtil';
import { createWalletClient, http } from 'viem';
import { polygonMumbai } from 'viem/chains';

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

function convertAccountToSmartAccountSigner(account: PKPViemAccount) {
  const walletClient = createWalletClient({
    account,
    chain: polygonMumbai,
    transport: http(),
  });
  return convertWalletClientToAccountSigner(walletClient);
}

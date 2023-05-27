import config from 'config.json';
import SettingsStore from '@/store/SettingsStore';
import { getZeroDevSigner } from '@zerodevapp/sdk';
import { SupportedGasToken } from '@zerodevapp/sdk/dist/src/types';
import { PKPEthersWallet } from '@lit-protocol/pkp-ethers';
import { AuthSig } from '@lit-protocol/types';

/**
 * Utilities
 */
export async function createOrRestoreERC4337Wallet(
  pkpPubKey: string,
  authSig: AuthSig
) {
  const signer = await getERC4337Signer(pkpPubKey, authSig);
  const address = await signer.getAddress();
  SettingsStore.setERC4337Address(address);
  SettingsStore.setWeb3WalletReady(true);

  return address;
}

export async function getERC4337Signer(pkpPubKey: string, authSig: AuthSig) {
  return getZeroDevSigner({
    projectId: config.defaultProjectId,
    owner: new PKPEthersWallet({
      pkpPubKey: pkpPubKey,
      controllerAuthSig: authSig,
    }),
  });
}

export async function getERC4337SignerWithERC20Gas(
  gasToken: SupportedGasToken,
  pkpPubKey: string,
  authSig: AuthSig
) {
  return getZeroDevSigner({
    projectId: config.defaultProjectId,
    owner: new PKPEthersWallet({
      pkpPubKey: pkpPubKey,
      controllerAuthSig: authSig,
    }),
    gasToken: gasToken,
  });
}

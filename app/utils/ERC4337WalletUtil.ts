import config from 'config.json';
import SettingsStore from '@/store/SettingsStore';
import { getZeroDevSigner } from '@zerodevapp/sdk';
import { Wallet } from 'ethers';
import { SupportedGasToken } from '@zerodevapp/sdk/dist/src/types';

/**
 * Utilities
 */
export async function createOrRestoreERC4337Wallet() {
  const signer = await getERC4337Signer();
  const address = await signer.getAddress();
  SettingsStore.setERC4337Address(address);
  SettingsStore.setWeb3WalletReady(true);

  return address;
}

export async function getERC4337Signer() {
  return getZeroDevSigner({
    projectId: config.defaultProjectId,
    owner: new Wallet(config.signingKey),
  });
}

export async function getERC4337SignerWithERC20Gas(
  gasToken: SupportedGasToken
) {
  return getZeroDevSigner({
    projectId: config.defaultProjectId,
    owner: new Wallet(config.signingKey),
    gasToken: gasToken,
  });
}

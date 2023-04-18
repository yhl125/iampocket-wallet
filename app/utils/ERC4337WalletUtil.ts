import { getSimpleAccount } from '@/api/src';
import { ethers } from 'ethers';
import config from 'config.json';
import SettingsStore from '@/store/SettingsStore';

/**
 * Utilities
 */
export async function createOrRestoreERC4337Wallet() {
  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  const accountAPI = getSimpleAccount(
    provider,
    config.signingKey,
    config.entryPoint,
    config.simpleAccountFactory
  );
  const address = await accountAPI.getCounterFactualAddress();
  SettingsStore.setERC4337Address(address);
  SettingsStore.setWeb3WalletReady(true);

  return address;
}

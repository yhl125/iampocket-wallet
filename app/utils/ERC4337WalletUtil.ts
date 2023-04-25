import config from 'config.json';
import SettingsStore from '@/store/SettingsStore';
import { Presets } from 'userop';

/**
 * Utilities
 */
export async function createOrRestoreERC4337Wallet() {
  const simpleAccount = await getERC4337Wallet();
  const address = simpleAccount.getSender();
  SettingsStore.setERC4337Address(address);
  SettingsStore.setWeb3WalletReady(true);

  return address;
}

export async function getERC4337Wallet() {
  const simpleAccount = await Presets.Builder.SimpleAccount.init(
    config.signingKey,
    config.rpcUrl,
    config.entryPoint,
    config.simpleAccountFactory
  );
  return simpleAccount;
}
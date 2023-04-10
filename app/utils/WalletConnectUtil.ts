import SettingsStore from '@/store/SettingsStore';
import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';

export let web3wallet: InstanceType<typeof Web3Wallet>;
export let core: InstanceType<typeof Core>;

export async function createWeb3Wallet() {
  if (!SettingsStore.state.web3WalletReady && typeof window !== 'undefined') {
    core = new Core({
      projectId: process.env.WALLETCONNECT_PROJECT_ID,
    });

    web3wallet = await Web3Wallet.init({
      core, // <- pass the shared `core` instance
      metadata: {
        name: 'Demo app',
        description: 'Demo Client as Wallet/Peer',
        url: 'www.walletconnect.com',
        icons: [],
      },
    });

    SettingsStore.setWeb3WalletReady(true);
  }
}

import { proxy } from 'valtio';

/**
 * Types
 */
interface State {
  account: number;
  erc4337Address: string;
  web3WalletReady: boolean;
}

/**
 * State
 */
const state = proxy<State>({
  account: 0,
  erc4337Address: '',
  web3WalletReady: false,
});

/**
 * Store / Actions
 */
const SettingsStore = {
  state,
  setAccount(value: number) {
    state.account = value;
  },

  setERC4337Address(erc4337Address: string) {
    state.erc4337Address = erc4337Address;
  },

  setWeb3WalletReady(value: boolean) {
    state.web3WalletReady = value;
  },
};

export default SettingsStore;

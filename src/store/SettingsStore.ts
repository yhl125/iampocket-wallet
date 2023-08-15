import { proxy } from 'valtio';

/**
 * Types
 */
interface State {
  web3WalletReady: boolean;
}

/**
 * State
 */
const state = proxy<State>({
  web3WalletReady: false,
});

/**
 * Store / Actions
 */
const SettingsStore = {
  state,

  setWeb3WalletReady(value: boolean) {
    state.web3WalletReady = value;
  },
};

export default SettingsStore;

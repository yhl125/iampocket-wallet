import { proxy } from 'valtio';

/**
 * Types
 */
interface State {
  testNets: boolean;
  account: number;
  erc4337Address: string;
  web3WalletReady: boolean;
}

/**
 * State
 */
const state = proxy<State>({
  testNets:
    typeof localStorage !== 'undefined'
      ? Boolean(localStorage.getItem('TEST_NETS'))
      : true,
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

  toggleTestNets() {
    state.testNets = !state.testNets;
    if (state.testNets) {
      localStorage.setItem('TEST_NETS', 'YES');
    } else {
      localStorage.removeItem('TEST_NETS');
    }
  },

  setWeb3WalletReady(value: boolean) {
    state.web3WalletReady = value;
  },
};

export default SettingsStore;

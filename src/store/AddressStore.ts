import { proxyWithLocalStorage } from '@/utils/StoreUtil';

/**
 * Types
 */
interface State {
  zeroDevAddress: string;
  biconomyAddress: string;
  pkpEthersAddress: string;
  selectedWallet: 'zeroDev' | 'biconomy'| 'pkpEthers';
}

/**
 * State
 */
const state = proxyWithLocalStorage<State>('AddressState', {
  zeroDevAddress: '',
  biconomyAddress: '',
  pkpEthersAddress: '',
  selectedWallet: 'zeroDev',
});

/**
 * Store / Actions
 */
const AddressStore = {
  state,
  setZeroDevAddress(zerodevAddress: string) {
    state.zeroDevAddress = zerodevAddress;
  },
  setBiconomyAddress(biconomyAddress: string) {
    state.biconomyAddress = biconomyAddress;
  },
  setPkpEthersAddress(pkpEthersAddress: string) {
    state.pkpEthersAddress = pkpEthersAddress;
  },
  setSelectedWallet(selectedWallet: 'zeroDev' | 'biconomy' | 'pkpEthers') {
    state.selectedWallet = selectedWallet;
  },
};

export default AddressStore;

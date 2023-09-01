import { proxyWithLocalStorage } from '@/utils/StoreUtil';

/**
 * Types
 */
interface State {
  zeroDevAddress: string;
  biconomyAddress: string;
  selectedWallet: 'zeroDev' | 'biconomy';
}

/**
 * State
 */
const state = proxyWithLocalStorage<State>('AddressState', {
  zeroDevAddress: '',
  biconomyAddress: '',
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
  setSelectedWallet(selectedWallet: 'zeroDev' | 'biconomy') {
    state.selectedWallet = selectedWallet;
  }
};

export default AddressStore;

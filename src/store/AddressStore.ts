import { proxyWithLocalStorage } from '@/utils/StoreUtil';

export type selectedWalletType = 'zeroDev' | 'pkpViem';
/**
 * Types
 */
interface State {
  zeroDevAddress: string;
  pkpViemAddress: string;
  selectedWallet: selectedWalletType;
}

/**
 * State
 */
const state = proxyWithLocalStorage<State>('AddressState', {
  zeroDevAddress: '',
  pkpViemAddress: '',
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
  setPkpViemAddress(pkpViemAddress: string) {
    state.pkpViemAddress = pkpViemAddress;
  },
  setSelectedWallet(selectedWallet: selectedWalletType) {
    state.selectedWallet = selectedWallet;
  },
};

export default AddressStore;
